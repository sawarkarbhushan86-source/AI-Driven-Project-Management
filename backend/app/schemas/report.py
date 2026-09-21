from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ReportGenerateRequest(BaseModel):
    project_id: int
    report_type: str = "WEEKLY" # WEEKLY, MONTHLY, SPRINT
    custom_notes: Optional[str] = ""

class ReportOut(BaseModel):
    id: int
    project_id: int
    generated_by_id: Optional[int]
    report_type: str
    title: str
    summary: str
    recommendations: Optional[str]
    metrics_json: Optional[Dict[str, Any]]
    pdf_url: Optional[str] = None
    excel_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
