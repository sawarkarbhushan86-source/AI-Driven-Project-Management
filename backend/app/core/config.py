import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Driven Project Management Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-jwt-signing-key-ai-pmp-2026-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    # Database
    # Seamless support for PostgreSQL (default docker) or fallback local SQLite
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./ai_pmp.db"
    )

    # GenAI / Gemini Settings
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "*"
    ]

    # File uploads
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
