from app.models.course import (
    Faculty,
    Program,
    PLO,
    Course,
    CLO,
    CLOPLOMapping,
    CourseSection,
    Instructor,
)
from app.models.tqf3 import (
    TQF3Report,
    RubricLevel,
    AssessmentCriteria,
    WeeklyPlan,
)
from app.models.tqf5 import (
    TQF5Report,
    CLOAchievementReport,
)
from app.models.tqf3_artifact import (
    CourseGeneralInfoTemplate,
    ProgramTemplate,
    TQF3Artifact,
)

__all__ = [
    "Faculty",
    "Program",
    "PLO",
    "Course",
    "CLO",
    "CLOPLOMapping",
    "CourseSection",
    "Instructor",
    "TQF3Report",
    "RubricLevel",
    "AssessmentCriteria",
    "WeeklyPlan",
    "TQF5Report",
    "CLOAchievementReport",
    "CourseGeneralInfoTemplate",
    "ProgramTemplate",
    "TQF3Artifact",
]
