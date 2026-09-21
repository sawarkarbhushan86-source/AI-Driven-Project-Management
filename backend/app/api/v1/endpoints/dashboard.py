from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import date, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.task_update import TaskUpdate
from app.models.team_performance import TeamPerformance
from app.schemas.dashboard import DashboardSummaryOut, TeacherProjectSummary, StatusDistribution, BurndownPoint, ProductivityMetric

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Main executive analytics dashboard overview with burndown chart,
    status distribution, productivity, and health metrics.
    """
    projects = db.query(Project).filter(Project.archived == False).all()
    tasks = db.query(Task).all()

    total_projects = len(projects)
    active_projects = sum(1 for p in projects if p.status == "IN_PROGRESS")
    avg_health = float(sum(float(p.health_score or 100) for p in projects) / max(1, total_projects))

    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "COMPLETED")
    blocked_tasks = sum(1 for t in tasks if t.status == "BLOCKED")
    overall_completion = round((completed_tasks / max(1, total_tasks)) * 100, 1)

    high_risk_projects = sum(1 for p in projects if p.delay_risk_level == "HIGH" or float(p.predicted_delay_days or 0) > 5.0)

    # Status breakdown
    status_dist = StatusDistribution(
        todo=sum(1 for t in tasks if t.status == "TODO"),
        in_progress=sum(1 for t in tasks if t.status == "IN_PROGRESS"),
        in_review=sum(1 for t in tasks if t.status == "IN_REVIEW"),
        completed=completed_tasks,
        blocked=blocked_tasks
    )

    # Burndown chart points (simulated 14-day sprint curve based on actual tasks)
    burndown = []
    total_scope_hours = float(sum(float(t.estimated_hours or 8.0) for t in tasks))
    total_actual_hours = float(sum(float(t.actual_hours or 0.0) for t in tasks))
    
    # 10 days of sprint burn-down
    for i in range(10):
        day_label = f"Day {i+1}"
        ideal = round(max(0.0, total_scope_hours * (1.0 - (i / 10.0))), 1)
        actual = round(max(0.0, total_scope_hours - (total_actual_hours * (i / 10.0) * 1.2)), 1)
        burndown.append(BurndownPoint(
            day=day_label,
            ideal_remaining=ideal,
            actual_remaining=actual
        ))

    # Team Productivity
    devs = db.query(User).filter(User.role.in_(["DEVELOPER", "TEAM_LEAD"])).all()
    productivity_list = []
    for d in devs:
        dev_tasks = [t for t in tasks if t.assigned_to_id == d.id]
        completed_d = sum(1 for t in dev_tasks if t.status == "COMPLETED")
        hours_d = [float(t.actual_hours or 8.0) for t in dev_tasks]
        avg_h = round(sum(hours_d) / max(1, len(hours_d)), 1)
        score = 85.0 + min(12.0, completed_d * 2.5) - (5.0 if any(t.status == "BLOCKED" for t in dev_tasks) else 0.0)

        productivity_list.append(ProductivityMetric(
            developer_name=d.full_name,
            tasks_completed=completed_d,
            avg_hours_per_task=avg_h,
            productivity_score=round(score, 1)
        ))

    # Recent blockers
    recent_updates = (
        db.query(TaskUpdate)
        .join(Task)
        .filter(TaskUpdate.blockers.isnot(None))
        .order_by(TaskUpdate.created_at.desc())
        .limit(6)
        .all()
    )
    blockers_data = []
    for u in recent_updates:
        if u.blockers and u.blockers.lower() not in ["none", "no", "nil", "n/a"]:
            blockers_data.append({
                "id": u.id,
                "task_title": u.task.title,
                "developer_name": u.user.full_name if u.user else "Developer",
                "blocker_text": u.blockers,
                "created_at": str(u.created_at)
            })

    return DashboardSummaryOut(
        total_projects=total_projects,
        active_projects=active_projects,
        average_health_score=round(avg_health, 1),
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        blocked_tasks=blocked_tasks,
        overall_completion_percentage=overall_completion,
        high_risk_projects_count=high_risk_projects,
        status_distribution=status_dist,
        burndown_series=burndown,
        team_productivity=productivity_list,
        top_projects=projects[:4],
        recent_blockers=blockers_data
    )

@router.get("/teacher/overview", response_model=List[TeacherProjectSummary])
def get_teacher_projects_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Real-time oversight for Teachers and Clients to monitor all projects at a glance.
    """
    projects = db.query(Project).filter(Project.archived == False).all()
    summaries = []

    for p in projects:
        tasks = db.query(Task).filter(Task.project_id == p.id).all()
        completed = sum(1 for t in tasks if t.status == "COMPLETED")
        blocked = sum(1 for t in tasks if t.status == "BLOCKED")
        total = max(1, len(tasks))
        comp_pct = round((completed / total) * 100, 1)

        members = db.query(ProjectMember).filter(ProjectMember.project_id == p.id).all()
        lead = p.created_by.full_name if p.created_by else "Unassigned"

        summaries.append(TeacherProjectSummary(
            id=p.id,
            name=p.name,
            health_score=float(p.health_score or 100),
            predicted_delay_days=float(p.predicted_delay_days or 0),
            delay_risk_level=p.delay_risk_level or "LOW",
            status=p.status,
            deadline=str(p.deadline),
            lead_name=lead,
            member_count=len(members),
            completion_percentage=comp_pct,
            active_blockers_count=blocked
        ))

    return summaries
