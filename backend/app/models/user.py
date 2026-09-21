from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), nullable=False, default="DEVELOPER") # ADMIN, PROJECT_MANAGER, TEAM_LEAD, DEVELOPER, CLIENT_TEACHER
    avatar_url = Column(String(500), nullable=True)
    department = Column(String(100), default="Engineering")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    created_projects = relationship("Project", back_populates="created_by", foreign_keys="Project.created_by_id")
    assigned_tasks = relationship("Task", back_populates="assigned_to", foreign_keys="Task.assigned_to_id")
    task_updates = relationship("TaskUpdate", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    performance_records = relationship("TeamPerformance", back_populates="user")
