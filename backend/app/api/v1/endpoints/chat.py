from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.chat_message import ChatMessage
from app.models.project import Project
from app.schemas.chat import ChatMessageCreate, ChatMessageOut

router = APIRouter()

@router.get("/{project_id}", response_model=List[ChatMessageOut])
def get_project_chat(
    project_id: int,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get message history for project team discussion room.
    """
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.project_id == project_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(limit)
        .all()
    )
    return messages

@router.post("/", response_model=ChatMessageOut, status_code=status.HTTP_201_CREATED)
def send_chat_message(
    msg_in: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Post a new discussion message to the project room.
    """
    project = db.query(Project).filter(Project.id == msg_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_msg = ChatMessage(
        project_id=msg_in.project_id,
        sender_id=current_user.id,
        message=msg_in.message,
        attachment_file_id=msg_in.attachment_file_id
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg
