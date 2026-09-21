from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    projects,
    tasks,
    updates,
    dashboard,
    ai,
    reports,
    chat,
    notifications
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(projects.router, prefix="/projects", tags=["Project Management"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Task Management"])
api_router.include_router(updates.router, prefix="/updates", tags=["Daily Progress Updates"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Analytics Dashboard"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Monitoring & Copilot"])
api_router.include_router(reports.router, prefix="/reports", tags=["AI Reports & Exports"])
api_router.include_router(chat.router, prefix="/chat", tags=["Team Discussion"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notification Center"])
