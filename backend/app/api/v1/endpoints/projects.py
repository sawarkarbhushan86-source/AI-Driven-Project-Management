from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.user import User
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.project_risk import ProjectRisk
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut, ProjectDetailOut, ProjectMemberOut
from app.services.ai_service import ai_service
from app.services.notification_service import notification_service

router = APIRouter()

@router.get("/", response_model=List[ProjectOut])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    include_archived: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all active projects.
    """
    query = db.query(Project)
    if not include_archived:
        query = query.filter(Project.archived == False)
    if status_filter:
        query = query.filter(Project.status == status_filter)
    
    projects = query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()
    return projects

@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "PROJECT_MANAGER"]))
):
    """
    Create a new project (Admin or Project Manager).
    """
    new_project = Project(
        name=project_in.name,
        description=project_in.description,
        status=project_in.status,
        health_score=100.0,
        predicted_delay_days=0.0,
        delay_risk_level="LOW",
        start_date=project_in.start_date,
        deadline=project_in.deadline,
        budget=project_in.budget,
        created_by_id=current_user.id,
        archived=False
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # Add creator as Project Manager member
    lead_member = ProjectMember(
        project_id=new_project.id,
        user_id=current_user.id,
        role_in_project="PROJECT_MANAGER",
        allocated_hours_per_week=20
    )
    db.add(lead_member)

    # Add selected members
    if project_in.member_ids:
        for u_id in set(project_in.member_ids):
            if u_id != current_user.id:
                member = ProjectMember(
                    project_id=new_project.id,
                    user_id=u_id,
                    role_in_project="MEMBER",
                    allocated_hours_per_week=40
                )
                db.add(member)
                notification_service.send_notification(
                    user_id=u_id,
                    title="Added to Project",
                    message=f"You were added to project '{new_project.name}'.",
                    notif_type="UPDATE",
                    action_url=f"/projects/{new_project.id}",
                    db=db
                )

    db.commit()
    return new_project

@router.get("/{project_id}", response_model=ProjectDetailOut)
def get_project_detail(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed project metrics, total tasks, and completion ratio.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "COMPLETED")
    pending_tasks = total_tasks - completed_tasks
    progress_pct = round((completed_tasks / max(1, total_tasks)) * 100, 1)

    risks = db.query(ProjectRisk).filter(
        ProjectRisk.project_id == project_id,
        ProjectRisk.resolved == False
    ).all()

    detail = ProjectDetailOut(
        id=project.id,
        name=project.name,
        description=project.description,
        status=project.status,
        health_score=float(project.health_score),
        predicted_delay_days=float(project.predicted_delay_days),
        delay_risk_level=project.delay_risk_level,
        start_date=project.start_date,
        deadline=project.deadline,
        budget=float(project.budget or 0),
        created_by_id=project.created_by_id,
        archived=project.archived,
        created_at=project.created_at,
        updated_at=project.updated_at,
        created_by=project.created_by,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        progress_percentage=progress_pct,
        active_risks_count=len(risks)
    )
    return detail

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD"]))
):
    """
    Update project details.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN"]))
):
    """
    Permanently delete a project (Admin only).
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return None

@router.post("/{project_id}/archive", response_model=ProjectOut)
def archive_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "PROJECT_MANAGER"]))
):
    """
    Archive project without deleting data.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.archived = True
    project.status = "ARCHIVED"
    db.commit()
    db.refresh(project)
    return project

@router.post("/{project_id}/evaluate-health")
def evaluate_project_health(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Manually trigger AI health score evaluation and ML delay prediction.
    """
    result = ai_service.evaluate_project_health_and_delay(project_id, db)
    return result
