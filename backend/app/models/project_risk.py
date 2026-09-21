from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class ProjectRisk(Base):
    __tablename__ = "project_risks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    risk_type = Column(String(50), default="SCHEDULE", nullable=False) # SCHEDULE, RESOURCE, TECHNICAL, BUDGET, EXTERNAL
    severity = Column(String(50), default="MEDIUM", nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    title = Column(String(250), nullable=False)
    description = Column(Text, nullable=False)
    suggested_mitigation = Column(Text, nullable=True)
    detected_by_ai = Column(Boolean, default=True)
    resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    project = relationship("Project", back_populates="risks")
