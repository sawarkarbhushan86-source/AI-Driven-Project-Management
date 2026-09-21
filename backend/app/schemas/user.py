from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    PROJECT_MANAGER = "PROJECT_MANAGER"
    TEAM_LEAD = "TEAM_LEAD"
    DEVELOPER = "DEVELOPER"
    CLIENT_TEACHER = "CLIENT_TEACHER"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.DEVELOPER
    department: Optional[str] = "Engineering"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
