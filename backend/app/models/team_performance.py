from sqlalchemy import Column, Integer, Numeric, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone, date
from app.core.database import Base

class TeamPerformance(Base):
    __tablename__ = "team_performance"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tasks_completed = Column(Integer, default=0)
    average_completion_time_hrs = Column(Numeric(6, 2), default=0.00)
    productivity_score = Column(Numeric(5, 2), default=85.00)
    on_time_delivery_rate = Column(Numeric(5, 2), default=90.00)
    recorded_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint('project_id', 'user_id', 'recorded_date', name='uix_proj_user_date'),
    )

    # Relationships
    user = relationship("User", back_populates="performance_records")
