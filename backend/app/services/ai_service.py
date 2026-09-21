import os
import sys
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import date, datetime, timezone

# Add parent directory to sys.path so ml_models can be imported seamlessly
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from ml_models.predictor import ProjectDelayPredictor
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.task_update import TaskUpdate
from app.models.project_risk import ProjectRisk

logger = logging.getLogger(__name__)

class AiMonitoringService:
    def __init__(self):
        self.predictor = ProjectDelayPredictor.get_instance()

    def evaluate_project_health_and_delay(self, project_id: int, db: Session) -> Dict[str, Any]:
        """
        Gathers live project features from the database, feeds them to the ML model,
        updates the project record in DB, and detects risk factors.
        """
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"error": "Project not found"}

        tasks = db.query(Task).filter(Task.project_id == project_id).all()
        task_count = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.status == "COMPLETED")
        pending_tasks = task_count - completed_tasks

        members = db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()
        team_size = max(1, len(members))

        # Average hours
        hours_list = [float(t.actual_hours or t.estimated_hours or 8.0) for t in tasks]
        avg_completion_time = float(sum(hours_list) / max(1, len(hours_list)))

        # Workload allocation
        resource_allocation = round(pending_tasks / (team_size * 4.0), 2)

        # Count active blockers from recent task updates
        recent_updates = (
            db.query(TaskUpdate)
            .join(Task)
            .filter(Task.project_id == project_id)
            .order_by(TaskUpdate.created_at.desc())
            .limit(20)
            .all()
        )
        
        blockers = [u.blockers for u in recent_updates if u.blockers and u.blockers.lower() not in ["none", "no", "n/a", "nil", ""]]
        blocked_tasks_count = sum(1 for t in tasks if t.status == "BLOCKED")
        blocker_count = max(len(blockers), blocked_tasks_count)

        # Historical delay
        historical_delays = 1.5 if project.status == "IN_PROGRESS" else 0.0

        # Predict with ML pipeline
        prediction = self.predictor.predict(
            task_count=task_count,
            completed_tasks=completed_tasks,
            pending_tasks=pending_tasks,
            team_size=team_size,
            average_completion_time=avg_completion_time,
            resource_allocation=resource_allocation,
            historical_delays=historical_delays,
            blocker_count=blocker_count
        )

        # Update Project record in DB
        project.health_score = prediction["health_score"]
        project.predicted_delay_days = prediction["predicted_delay_days"]
        project.delay_risk_level = prediction["risk_level"]
        db.commit()
        db.refresh(project)

        # Auto-detect risks and save
        self.detect_and_sync_risks(project, tasks, blockers, db)

        risk_factors = []
        if blocker_count > 0:
            risk_factors.append(f"{blocker_count} active blockers currently impeding sprint progress.")
        if resource_allocation > 1.4:
            risk_factors.append(f"High workload pressure index ({resource_allocation}x capacity) on engineering team.")
        if prediction["predicted_delay_days"] > 4.0:
            risk_factors.append(f"Predicted deadline slippage of {prediction['predicted_delay_days']} days detected.")
        if not risk_factors:
            risk_factors.append("Sprint velocity is optimal with steady milestone progression.")

        return {
            "project_id": project.id,
            "project_name": project.name,
            "health_score": float(project.health_score),
            "predicted_delay_days": float(project.predicted_delay_days),
            "risk_level": project.delay_risk_level,
            "engine": prediction.get("engine", "ML_MODEL"),
            "risk_factors": risk_factors,
            "metrics": {
                "task_count": task_count,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "team_size": team_size,
                "blockers_count": blocker_count,
                "resource_allocation": resource_allocation
            }
        }

    def detect_and_sync_risks(self, project: Project, tasks: List[Task], blockers: List[str], db: Session):
        """
        Heuristic & ML-assisted risk categorization and mitigation synthesizer.
        """
        # 1. Overdue or Blocked tasks
        today = date.today()
        for t in tasks:
            if t.status == "BLOCKED" and not t.is_at_risk:
                t.is_at_risk = True
                t.risk_reason = "Task marked as BLOCKED by developer."
            elif t.deadline and t.deadline < today and t.status != "COMPLETED":
                t.is_at_risk = True
                t.risk_reason = f"Deadline exceeded ({t.deadline})."

        db.commit()

        # 2. Project Risks table sync
        if float(project.predicted_delay_days) >= 4.0:
            existing_schedule_risk = db.query(ProjectRisk).filter(
                ProjectRisk.project_id == project.id,
                ProjectRisk.risk_type == "SCHEDULE",
                ProjectRisk.resolved == False
            ).first()

            if not existing_schedule_risk:
                severity = "CRITICAL" if float(project.predicted_delay_days) > 7.0 else "HIGH"
                new_risk = ProjectRisk(
                    project_id=project.id,
                    risk_type="SCHEDULE",
                    severity=severity,
                    title=f"Milestone Slippage Risk (+{project.predicted_delay_days} days)",
                    description=f"AI monitoring engine forecast a project delay of {project.predicted_delay_days} days based on current burn-down velocity and pending tasks.",
                    suggested_mitigation="Re-evaluate low-priority scope items, reassign unblocked developers to critical path, or adjust sprint milestone target.",
                    detected_by_ai=True,
                    resolved=False
                )
                db.add(new_risk)
                db.commit()

ai_service = AiMonitoringService()
