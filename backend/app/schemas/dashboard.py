from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.schemas.project import ProjectOut

class BurndownPoint(BaseModel):
    day: str
    ideal_remaining: float
    actual_remaining: float

class ProductivityMetric(BaseModel):
    developer_name: str
    tasks_completed: int
    avg_hours_per_task: float
    productivity_score: float

class StatusDistribution(BaseModel):
    todo: int
    in_progress: int
    in_review: int
    completed: int
    blocked: int

class DashboardSummaryOut(BaseModel):
    total_projects: int
    active_projects: int
    average_health_score: float
    total_tasks: int
    completed_tasks: int
    blocked_tasks: int
    overall_completion_percentage: float
    high_risk_projects_count: int
    status_distribution: StatusDistribution
    burndown_series: List[BurndownPoint]
    team_productivity: List[ProductivityMetric]
    top_projects: List[ProjectOut]
    recent_blockers: List[Dict[str, Any]]

class TeacherProjectSummary(BaseModel):
    id: int
    name: str
    health_score: float
    predicted_delay_days: float
    delay_risk_level: str
    status: str
    deadline: str
    lead_name: str
    member_count: int
    completion_percentage: float
    active_blockers_count: int
