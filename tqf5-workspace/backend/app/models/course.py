from typing import Optional, List
from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field, Relationship

class Faculty(SQLModel, table=True):
    __tablename__ = "faculties"
    faculty_id: str = Field(primary_key=True)
    faculty_name_th: str
    faculty_name_en: str

class Program(SQLModel, table=True):
    __tablename__ = "programs"
    program_id: str = Field(primary_key=True)
    faculty_id: str = Field(foreign_key="faculties.faculty_id")
    program_name_th: str
    program_name_en: str
    curriculum_year: int

class PLO(SQLModel, table=True):
    __tablename__ = "plos"
    plo_id: Optional[int] = Field(default=None, primary_key=True)
    program_id: str = Field(foreign_key="programs.program_id")
    plo_code: str
    plo_category: str  # Knowledge (K), Skill (S), Ethics (E), Character (C)
    plo_description: str

class Course(SQLModel, table=True):
    __tablename__ = "courses"
    course_id: str = Field(primary_key=True)
    program_id: str = Field(foreign_key="programs.program_id")
    course_code_th: str
    course_name_th: str
    course_name_en: str
    credits: float
    lecture_hours: int
    lab_hours: int

class CLO(SQLModel, table=True):
    __tablename__ = "clos"
    clo_id: Optional[int] = Field(default=None, primary_key=True)
    course_id: str = Field(foreign_key="courses.course_id")
    clo_code: str
    clo_description: str

class CLOPLOMapping(SQLModel, table=True):
    __tablename__ = "clo_plo_mapping"
    __table_args__ = (UniqueConstraint("clo_id", "plo_id", name="uq_clo_plo_mapping"),)
    mapping_id: Optional[int] = Field(default=None, primary_key=True)
    clo_id: int = Field(foreign_key="clos.clo_id")
    plo_id: int = Field(foreign_key="plos.plo_id")

class CourseSection(SQLModel, table=True):
    __tablename__ = "course_sections"
    section_id: Optional[int] = Field(default=None, primary_key=True)
    course_id: str = Field(foreign_key="courses.course_id")
    section_number: str = Field(default="1")
    semester: int
    academic_year: int

class Instructor(SQLModel, table=True):
    __tablename__ = "instructors"
    instructor_id: str = Field(primary_key=True)
    first_name: str
    last_name: str
    email: str
    room: Optional[str] = None
