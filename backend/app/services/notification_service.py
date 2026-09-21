import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User

logger = logging.getLogger(__name__)

class NotificationService:
    def send_notification(
        self,
        user_id: int,
        title: str,
        message: str,
        notif_type: str = "UPDATE",
        action_url: Optional[str] = None,
        db: Session = None
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            action_url=action_url,
            is_read=False
        )
        if db:
            db.add(notif)
            db.commit()
            db.refresh(notif)
        
        logger.info(f"[NOTIF] Dispatched {notif_type} notification to User #{user_id}: '{title}'")
        return notif

    def notify_project_stakeholders(
        self,
        project_id: int,
        title: str,
        message: str,
        notif_type: str,
        db: Session
    ):
        from app.models.project import ProjectMember, Project
        members = db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()
        for m in members:
            self.send_notification(
                user_id=m.user_id,
                title=title,
                message=message,
                notif_type=notif_type,
                action_url=f"/projects/{project_id}",
                db=db
            )

notification_service = NotificationService()
