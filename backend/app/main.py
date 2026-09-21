import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1.router import api_router
from ml_models.predictor import ProjectDelayPredictor

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and pre-load ML model into memory
    Base.metadata.create_all(bind=engine)
    ProjectDelayPredictor.get_instance()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Industry-Grade AI-Driven Project Management & Progress Monitoring Platform API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount reports and uploads directories for static asset retrieval
reports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
os.makedirs(reports_dir, exist_ok=True)
app.mount("/static/reports", StaticFiles(directory=reports_dir), name="reports")

@app.get("/", tags=["Health"])
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "api_v1": settings.API_V1_STR
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ai_engine": "active"
    }
