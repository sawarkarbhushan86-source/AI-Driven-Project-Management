from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.project_risk import ProjectRisk
from app.schemas.ai import (
    DelayPredictRequest,
    DelayPredictResponse,
    AiChatRequest,
    AiChatResponse,
    AiRiskDetectResponse,
    AiRecommendationOut
)
from app.services.ai_service import ai_service
from app.services.genai_service import genai_service

router = APIRouter()

@router.post("/predict-delay", response_model=DelayPredictResponse)
def predict_delay_endpoint(
    request: DelayPredictRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Run machine learning inference using Random Forest & XGBoost model artifacts
    to predict project delay days and risk category.
    """
    prediction = ai_service.predictor.predict(
        task_count=request.task_count,
        completed_tasks=request.completed_tasks,
        pending_tasks=request.pending_tasks,
        team_size=request.team_size,
        average_completion_time=request.average_completion_time,
        resource_allocation=request.resource_allocation,
        historical_delays=request.historical_delays,
        blocker_count=request.blocker_count
    )

    risk_factors = []
    if request.blocker_count > 0:
        risk_factors.append(f"{request.blocker_count} active blockers impeding velocity.")
    if request.resource_allocation > 1.5:
        risk_factors.append(f"Engineers overloaded at {request.resource_allocation}x capacity index.")
    if request.average_completion_time > 25:
        risk_factors.append("Above average task complexity / completion duration.")
    if not risk_factors:
        risk_factors.append("Standard sprint velocity and linear burn-down.")

    return DelayPredictResponse(
        predicted_delay_days=prediction["predicted_delay_days"],
        risk_level=prediction["risk_level"],
        health_score=prediction["health_score"],
        engine=prediction.get("engine", "ML_MODEL"),
        risk_factors=risk_factors
    )

@router.post("/chat", response_model=AiChatResponse)
def chat_with_copilot(
    chat_req: AiChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Conversational GenAI Project Assistant:
    Ask questions about delays, risk causes, team blockers, and corrective action recommendations.
    """
    result = genai_service.chat_with_project_copilot(
        prompt=chat_req.prompt,
        project_id=chat_req.project_id,
        chat_history=chat_req.chat_history,
        db=db
    )
    return AiChatResponse(
        response=result["response"],
        suggested_actions=result.get("suggested_actions", []),
        referenced_tasks=result.get("referenced_tasks", [])
    )

@router.get("/risks/{project_id}", response_model=AiRiskDetectResponse)
def detect_project_risks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Automated risk detection and recommended mitigations for a specific project.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    risks = db.query(ProjectRisk).filter(ProjectRisk.project_id == project_id).all()
    risk_list = []
    mitigations = []

    for r in risks:
        risk_list.append({
            "id": r.id,
            "type": r.risk_type,
            "severity": r.severity,
            "title": r.title,
            "description": r.description,
            "suggested_mitigation": r.suggested_mitigation,
            "resolved": r.resolved
        })
        if r.suggested_mitigation and not r.resolved:
            mitigations.append(r.suggested_mitigation)

    if not mitigations:
        mitigations.append("Maintain active daily standup cadence and monitor code review queue.")

    return AiRiskDetectResponse(
        project_id=project.id,
        project_name=project.name,
        overall_health=float(project.health_score or 100),
        detected_risks=risk_list,
        recommended_mitigations=mitigations
    )

@router.get("/recommendations/{project_id}", response_model=List[AiRecommendationOut])
def get_recommendations(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Smart, actionable corrective recommendations powered by the AI Monitoring Engine.
    """
    recs = genai_service.generate_smart_recommendations(project_id, db)
    return recs
