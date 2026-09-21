from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from app.schemas.user import UserOut

class TaskBase(BaseModel):
    title: str = Field(..., max_length=250)
    description: Optional[str] = None
    priority: str = "MEDIUM" # LOW, MEDIUM, HIGH, URGENT
    status: str = "TODO" # TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, BLOCKED
    estimated_hours: Optional[float] = 8.0
    actual_hours: Optional[float] = 0.0
    deadline: Optional[date] = None
    progress_percentage: Optional[int] = 0

class TaskCreate(TaskBase):
    project_id: int
    assigned_to_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to_id: Optional[int] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    deadline: Optional[date] = None
    progress_percentage: Optional[int] = None
    is_at_risk: Optional[bool] = None
    risk_reason: Optional[str] = None
    order_index: Optional[int] = None

class TaskStatusUpdate(BaseModel):
    status: str
    order_index: Optional[int] = None

class TaskOut(TaskBase):
    id: int
    project_id: int
    assigned_to_id: Optional[int] = None
    created_by_id: Optional[int] = None
    is_at_risk: bool = False
    risk_reason: Optional[str] = None
    order_index: int = 0
    assigned_to: Optional[UserOut] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
