from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from app.schemas.user import UserOut

class ProjectStatus(str):
    PLANNING = "PLANNING"
    IN_PROGRESS = "IN_PROGRESS"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

class ProjectBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    status: str = "IN_PROGRESS"
    start_date: date
    deadline: date
    budget: Optional[float] = 0.0

class ProjectCreate(ProjectBase):
    member_ids: Optional[List[int]] = []

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[date] = None
    budget: Optional[float] = None
    archived: Optional[bool] = None

class ProjectMemberOut(BaseModel):
    id: int
    user: UserOut
    role_in_project: str
    allocated_hours_per_week: int

    class Config:
        from_attributes = True

class ProjectOut(ProjectBase):
    id: int
    health_score: float
    predicted_delay_days: float
    delay_risk_level: str
    created_by_id: Optional[int]
    archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectDetailOut(ProjectOut):
    created_by: Optional[UserOut] = None
    total_tasks: int = 0
    completed_tasks: int = 0
    pending_tasks: int = 0
    progress_percentage: float = 0.0
    active_risks_count: int = 0
