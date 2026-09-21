from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserOut

class ChatMessageCreate(BaseModel):
    project_id: int
    message: str
    attachment_file_id: Optional[int] = None

class ChatMessageOut(BaseModel):
    id: int
    project_id: int
    sender_id: int
    message: str
    attachment_file_id: Optional[int]
    created_at: datetime
    sender: Optional[UserOut] = None

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    action_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
