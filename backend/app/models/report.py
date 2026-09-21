from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    generated_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    report_type = Column(String(50), default="WEEKLY", nullable=False) # WEEKLY, MONTHLY, SPRINT, AI_SUMMARY
    title = Column(String(250), nullable=False)
    summary = Column(Text, nullable=False)
    metrics_json = Column(JSON, nullable=True)
    recommendations = Column(Text, nullable=True)
    pdf_filename = Column(String(255), nullable=True)
    excel_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    project = relationship("Project", back_populates="reports")
    generated_by = relationship("User")
