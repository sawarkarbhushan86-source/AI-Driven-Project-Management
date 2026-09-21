from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DelayPredictRequest(BaseModel):
    task_count: int = Field(..., ge=1, description="Total tasks in project")
    completed_tasks: int = Field(..., ge=0, description="Tasks completed so far")
    pending_tasks: int = Field(..., ge=0, description="Tasks pending")
    team_size: int = Field(..., ge=1, description="Active engineers")
    average_completion_time: float = Field(..., ge=1.0, description="Average task hours")
    resource_allocation: float = Field(..., ge=0.1, description="Workload index")
    historical_delays: float = Field(..., ge=0.0, description="Previous delay days")
    blocker_count: int = Field(..., ge=0, description="Active blockers")

class DelayPredictResponse(BaseModel):
    predicted_delay_days: float
    risk_level: str # LOW, MEDIUM, HIGH
    health_score: float
    engine: str
    confidence_interval: Optional[str] = "+/- 1.2 days"
    risk_factors: List[str]

class AiRiskDetectResponse(BaseModel):
    project_id: int
    project_name: str
    overall_health: float
    detected_risks: List[Dict[str, Any]]
    recommended_mitigations: List[str]

class AiChatRequest(BaseModel):
    project_id: Optional[int] = None
    prompt: str = Field(..., min_length=2)
    chat_history: Optional[List[Dict[str, str]]] = []

class AiChatResponse(BaseModel):
    response: str
    suggested_actions: List[str] = []
    referenced_tasks: List[int] = []

class AiRecommendationOut(BaseModel):
    title: str
    category: str # RESOURCE, SCHEDULE, CODE_QUALITY, RISK
    impact: str # HIGH, MEDIUM, LOW
    description: str
    action_type: str
