from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(250), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="UPDATE", nullable=False) # EMAIL, DUE_DATE, RISK, UPDATE, SYSTEM
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    action_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="notifications")
