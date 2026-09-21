from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(250), nullable=False)
    description = Column(Text, nullable=True)
    assigned_to_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    priority = Column(String(50), default="MEDIUM", nullable=False) # LOW, MEDIUM, HIGH, URGENT
    status = Column(String(50), default="TODO", nullable=False) # TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, BLOCKED
    estimated_hours = Column(Numeric(6, 2), default=8.00)
    actual_hours = Column(Numeric(6, 2), default=0.00)
    deadline = Column(Date, nullable=True)
    progress_percentage = Column(Integer, default=0)
    is_at_risk = Column(Boolean, default=False)
    risk_reason = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assigned_to = relationship("User", back_populates="assigned_tasks", foreign_keys=[assigned_to_id])
    updates = relationship("TaskUpdate", back_populates="task", cascade="all, delete-orphan")
    files = relationship("FileRecord", back_populates="task", cascade="all, delete-orphan")
