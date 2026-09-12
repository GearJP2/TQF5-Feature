from typing import Optional, List
from typing import Literal

from pydantic import BaseModel, Field

class FacultyRead(BaseModel):
    faculty_id: str
    faculty_name_th: str
    faculty_name_en: str

class FacultyCreate(BaseModel):
    faculty_id: str
    faculty_name_th: str
    faculty_name_en: str

class ProgramRead(BaseModel):
    program_id: str
    faculty_id: str
    program_name_th: str
    program_name_en: str
    curriculum_year: int

class ProgramCreate(BaseModel):
    program_id: str
    faculty_id: str
    program_name_th: str
    program_name_en: str
    curriculum_year: int

class PLORead(BaseModel):
    plo_id: int
    program_id: str
    plo_code: str
    plo_category: str
    plo_description: str

class PLOCreate(BaseModel):
    program_id: str
    plo_code: str
    plo_category: str
    plo_description: str

class CLORead(BaseModel):
    clo_id: int
    course_id: str
    clo_code: str
    clo_description: str

class CLOCreate(BaseModel):
    course_id: str
    clo_code: str
    clo_description: str

class CourseRead(BaseModel):
    course_id: str
    program_id: str
    course_code_th: str
    course_name_th: str
    course_name_en: str
    credits: float
    lecture_hours: int
    lab_hours: int

class CourseCreate(BaseModel):
    course_id: str
    program_id: str
    course_code_th: str
    course_name_th: str
    course_name_en: str
    credits: float
    lecture_hours: int
    lab_hours: int

class CourseSectionRead(BaseModel):
    section_id: int
    course_id: str
    section_number: str
    semester: int
    academic_year: int

class CourseSectionCreate(BaseModel):
    course_id: str
    section_number: str = "1"
    semester: int
    academic_year: int


class CourseContextCreate(BaseModel):
    """A local operational record for a professor-selected course and section.

    This is created only after selection; it is not a cache of the upstream
    catalogue.
    """

    course_id: str = Field(min_length=1, max_length=255)
    course_code: str = Field(min_length=1, max_length=100)
    course_code_th: str = Field(default="", max_length=100)
    course_name_th: str = Field(default="", max_length=500)
    course_name_en: str = Field(min_length=1, max_length=500)
    credits: float = Field(default=3, ge=0)
    lecture_hours: int = Field(default=0, ge=0)
    lab_hours: int = Field(default=0, ge=0)
    section_number: str = Field(min_length=1, max_length=100)
    semester: int = Field(ge=1, le=3)
    academic_year: int = Field(ge=2500, le=9999)
    source: Literal["catalogue", "manual"]

class InstructorRead(BaseModel):
    instructor_id: str
    first_name: str
    last_name: str
    email: str
    room: Optional[str] = None
