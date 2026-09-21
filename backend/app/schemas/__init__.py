from app.schemas.user import UserBase, UserCreate, UserUpdate, UserOut, UserLogin, Token, TokenPayload, UserRole
from app.schemas.project import ProjectBase, ProjectCreate, ProjectUpdate, ProjectOut, ProjectDetailOut, ProjectMemberOut
from app.schemas.task import TaskBase, TaskCreate, TaskUpdate, TaskOut, TaskStatusUpdate
from app.schemas.update import TaskUpdateCreate, TaskUpdateOut
from app.schemas.dashboard import DashboardSummaryOut, BurndownPoint, ProductivityMetric, TeacherProjectSummary
from app.schemas.ai import DelayPredictRequest, DelayPredictResponse, AiRiskDetectResponse, AiChatRequest, AiChatResponse, AiRecommendationOut
from app.schemas.report import ReportGenerateRequest, ReportOut
from app.schemas.chat import ChatMessageCreate, ChatMessageOut, NotificationOut

__all__ = [
    "UserBase", "UserCreate", "UserUpdate", "UserOut", "UserLogin", "Token", "TokenPayload", "UserRole",
    "ProjectBase", "ProjectCreate", "ProjectUpdate", "ProjectOut", "ProjectDetailOut", "ProjectMemberOut",
    "TaskBase", "TaskCreate", "TaskUpdate", "TaskOut", "TaskStatusUpdate",
    "TaskUpdateCreate", "TaskUpdateOut",
    "DashboardSummaryOut", "BurndownPoint", "ProductivityMetric", "TeacherProjectSummary",
    "DelayPredictRequest", "DelayPredictResponse", "AiRiskDetectResponse", "AiChatRequest", "AiChatResponse", "AiRecommendationOut",
    "ReportGenerateRequest", "ReportOut",
    "ChatMessageCreate", "ChatMessageOut", "NotificationOut"
]
