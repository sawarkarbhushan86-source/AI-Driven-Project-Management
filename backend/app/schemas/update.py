from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.user import UserOut

class TaskUpdateCreate(BaseModel):
    task_id: int
    yesterday_work: str = Field(..., min_length=5)
    today_plan: str = Field(..., min_length=5)
    blockers: Optional[str] = "None"
    progress_percentage: int = Field(..., ge=0, le=100)
    hours_spent: Optional[float] = 0.0

class TaskUpdateOut(BaseModel):
    id: int
    task_id: int
    user_id: int
    yesterday_work: str
    today_plan: str
    blockers: Optional[str]
    progress_percentage: int
    hours_spent: float
    created_at: datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True
