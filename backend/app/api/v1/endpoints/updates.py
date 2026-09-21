from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.task import Task
from app.models.task_update import TaskUpdate
from app.schemas.update import TaskUpdateCreate, TaskUpdateOut
from app.services.ai_service import ai_service
from app.services.notification_service import notification_service

router = APIRouter()

@router.get("/", response_model=List[TaskUpdateOut])
def get_task_updates(
    task_id: Optional[int] = None,
    project_id: Optional[int] = None,
    user_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve chronological stream of daily standup progress updates.
    """
    query = db.query(TaskUpdate).join(Task)
    if task_id:
        query = query.filter(TaskUpdate.task_id == task_id)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if user_id:
        query = query.filter(TaskUpdate.user_id == user_id)

    updates = query.order_by(TaskUpdate.created_at.desc()).limit(limit).all()
    return updates

@router.post("/", response_model=TaskUpdateOut, status_code=status.HTTP_201_CREATED)
def submit_daily_update(
    update_in: TaskUpdateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit daily standup progress (Yesterday work, Today plan, Blockers, % progress).
    """
    task = db.query(Task).filter(Task.id == update_in.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    new_update = TaskUpdate(
        task_id=update_in.task_id,
        user_id=current_user.id,
        yesterday_work=update_in.yesterday_work,
        today_plan=update_in.today_plan,
        blockers=update_in.blockers or "None",
        progress_percentage=update_in.progress_percentage,
        hours_spent=update_in.hours_spent or 0.0
    )
    db.add(new_update)

    # Sync Task Progress and Hours
    task.progress_percentage = update_in.progress_percentage
    task.actual_hours = float(task.actual_hours or 0) + float(update_in.hours_spent or 0)

    # Handle Blockers & Status
    has_blocker = update_in.blockers and update_in.blockers.strip().lower() not in ["none", "no", "nil", "n/a", ""]
    if has_blocker:
        task.is_at_risk = True
        task.risk_reason = f"Developer reported blocker: {update_in.blockers}"
        task.status = "BLOCKED"

        # Trigger risk alert to Project Manager
        if task.project and task.project.created_by_id:
            notification_service.send_notification(
                user_id=task.project.created_by_id,
                title="New Blocker Reported",
                message=f"{current_user.full_name} reported blocker on '{task.title}': {update_in.blockers}",
                notif_type="RISK",
                action_url=f"/projects/{task.project_id}",
                db=db
            )
    elif update_in.progress_percentage == 100:
        task.status = "COMPLETED"
        task.is_at_risk = False
    elif task.status == "TODO" and update_in.progress_percentage > 0:
        task.status = "IN_PROGRESS"

    db.commit()
    db.refresh(new_update)

    # Trigger AI health recalculation
    ai_service.evaluate_project_health_and_delay(task.project_id, db)
    return new_update
