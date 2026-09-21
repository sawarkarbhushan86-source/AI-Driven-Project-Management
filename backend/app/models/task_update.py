from sqlalchemy import Column, Integer, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class TaskUpdate(Base):
    __tablename__ = "task_updates"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    yesterday_work = Column(Text, nullable=False)
    today_plan = Column(Text, nullable=False)
    blockers = Column(Text, nullable=True)
    progress_percentage = Column(Integer, nullable=False, default=0)
    hours_spent = Column(Numeric(5, 2), default=0.00)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    task = relationship("Task", back_populates="updates")
    user = relationship("User", back_populates="task_updates")
