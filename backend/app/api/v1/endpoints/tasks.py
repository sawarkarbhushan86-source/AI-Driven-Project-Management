from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.user import User
from app.models.task import Task
from app.models.project import Project
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut, TaskStatusUpdate
from app.services.notification_service import notification_service
from app.services.ai_service import ai_service

router = APIRouter()

@router.get("/", response_model=List[TaskOut])
def get_tasks(
    project_id: Optional[int] = None,
    assigned_to_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get tasks with optional filters by project, assignee, status, or priority.
    """
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if assigned_to_id:
        query = query.filter(Task.assigned_to_id == assigned_to_id)
    if status_filter:
        query = query.filter(Task.status == status_filter)
    if priority_filter:
        query = query.filter(Task.priority == priority_filter)

    tasks = query.order_by(Task.order_index.asc(), Task.deadline.asc()).all()
    return tasks

@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD"]))
):
    """
    Create a new task under a project.
    """
    project = db.query(Project).filter(Project.id == task_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Target project not found")

    new_task = Task(
        project_id=task_in.project_id,
        title=task_in.title,
        description=task_in.description,
        assigned_to_id=task_in.assigned_to_id,
        created_by_id=current_user.id,
        priority=task_in.priority,
        status=task_in.status,
        estimated_hours=task_in.estimated_hours,
        actual_hours=task_in.actual_hours,
        deadline=task_in.deadline,
        progress_percentage=task_in.progress_percentage or 0,
        is_at_risk=False
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    # Notify assignee
    if task_in.assigned_to_id:
        notification_service.send_notification(
            user_id=task_in.assigned_to_id,
            title="New Task Assigned",
            message=f"You have been assigned to task: '{new_task.title}' in project '{project.name}'.",
            notif_type="UPDATE",
            action_url="/tasks",
            db=db
        )

    # Recalculate project health
    ai_service.evaluate_project_health_and_delay(task_in.project_id, db)
    return new_task

@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update task attributes (assignee, priority, status, progress, deadline).
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_assignee = task.assigned_to_id
    update_data = task_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    # If new assignee was set, notify them
    if task_in.assigned_to_id and task_in.assigned_to_id != old_assignee:
        notification_service.send_notification(
            user_id=task_in.assigned_to_id,
            title="Task Reassigned to You",
            message=f"Task '{task.title}' has been assigned to you.",
            notif_type="UPDATE",
            action_url="/tasks",
            db=db
        )

    # Re-evaluate project health
    ai_service.evaluate_project_health_and_delay(task.project_id, db)
    return task

@router.patch("/{task_id}/status", response_model=TaskOut)
def update_task_status(
    task_id: int,
    status_update: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Drag-and-drop Kanban status update.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = status_update.status
    if status_update.order_index is not None:
        task.order_index = status_update.order_index
    if status_update.status == "COMPLETED":
        task.progress_percentage = 100
        task.is_at_risk = False
    elif status_update.status == "BLOCKED":
        task.is_at_risk = True

    db.commit()
    db.refresh(task)

    # Recalculate AI Health
    ai_service.evaluate_project_health_and_delay(task.project_id, db)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD"]))
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project_id = task.project_id
    db.delete(task)
    db.commit()

    ai_service.evaluate_project_health_and_delay(project_id, db)
    return None
