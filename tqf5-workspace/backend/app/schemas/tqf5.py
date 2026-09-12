from typing import Optional, List
from pydantic import BaseModel

class CLOAchievementCreate(BaseModel):
    clo_id: int
    target_percentage: int
    actual_percentage: int

class CLOAchievementRead(CLOAchievementCreate):
    achievement_id: int
    tqf5_id: int

class TQF5ReportCreate(BaseModel):
    section_id: int
    summary_student_count: Optional[int] = 0
    dropped_student_count: Optional[int] = 0
    tqf5_status: str = "draft"
    teaching_problems: Optional[str] = None
    improvement_plans: Optional[str] = None

class TQF5ReportRead(BaseModel):
    tqf5_id: int
    section_id: int
    summary_student_count: Optional[int] = 0
    dropped_student_count: Optional[int] = 0
    tqf5_status: str
    teaching_problems: Optional[str] = None
    improvement_plans: Optional[str] = None
    achievements: List[CLOAchievementRead] = []
