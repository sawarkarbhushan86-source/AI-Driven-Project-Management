from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_in_project = Column(String(50), default="MEMBER")
    allocated_hours_per_week = Column(Integer, default=40)
    joined_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="IN_PROGRESS", nullable=False) # PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, ARCHIVED
    health_score = Column(Numeric(5, 2), default=100.00)
    predicted_delay_days = Column(Numeric(5, 2), default=0.00)
    delay_risk_level = Column(String(50), default="LOW") # LOW, MEDIUM, HIGH
    start_date = Column(Date, nullable=False)
    deadline = Column(Date, nullable=False)
    budget = Column(Numeric(12, 2), default=0.00)
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    archived = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    created_by = relationship("User", back_populates="created_projects", foreign_keys=[created_by_id])
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    risks = relationship("ProjectRisk", back_populates="project", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="project", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="project", cascade="all, delete-orphan")
    files = relationship("FileRecord", back_populates="project", cascade="all, delete-orphan")
