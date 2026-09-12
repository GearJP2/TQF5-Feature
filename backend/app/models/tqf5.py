from typing import Optional
from sqlmodel import SQLModel, Field

class TQF5Report(SQLModel, table=True):
    __tablename__ = "tqf5_reports"
    tqf5_id: Optional[int] = Field(default=None, primary_key=True)
    section_id: int = Field(foreign_key="course_sections.section_id")
    summary_student_count: Optional[int] = Field(default=0)
    dropped_student_count: Optional[int] = Field(default=0)
    tqf5_status: str = Field(default="draft")
    teaching_problems: Optional[str] = None
    improvement_plans: Optional[str] = None

class CLOAchievementReport(SQLModel, table=True):
    __tablename__ = "clo_achievement_reports"
    achievement_id: Optional[int] = Field(default=None, primary_key=True)
    tqf5_id: int = Field(foreign_key="tqf5_reports.tqf5_id")
    clo_id: int = Field(foreign_key="clos.clo_id")
    target_percentage: int
    actual_percentage: int
