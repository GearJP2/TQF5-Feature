from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy import Column, JSON, UniqueConstraint
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ProgramTemplate(SQLModel, table=True):
    __tablename__ = "program_templates"

    template_id: Optional[int] = Field(default=None, primary_key=True)
    program_id: Optional[str] = Field(default=None, index=True)
    curriculum_id: Optional[str] = Field(default=None, index=True)
    pathway_id: Optional[str] = Field(default=None, index=True)
    template_type: str = Field(index=True)
    version: str = "1.0"
    content_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    active: bool = True
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)


class CourseGeneralInfoTemplate(SQLModel, table=True):
    __tablename__ = "course_general_info_templates"

    template_id: Optional[int] = Field(default=None, primary_key=True)
    course_id: Optional[str] = Field(default=None, index=True)
    program_id: Optional[str] = Field(default=None, index=True)
    curriculum_id: Optional[str] = Field(default=None, index=True)
    pathway_id: Optional[str] = Field(default=None, index=True)
    course_code: Optional[str] = None
    course_name_th: Optional[str] = None
    course_name_en: Optional[str] = None
    credits: Optional[float] = None
    lecture_hours: Optional[int] = None
    lab_hours: Optional[int] = None
    self_study_hours: Optional[int] = None
    prerequisite: Optional[str] = None
    corequisite: Optional[str] = None
    description_th: Optional[str] = None
    description_en: Optional[str] = None
    default_instructors_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    default_schedule_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    active: bool = True
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)


class TQF3Artifact(SQLModel, table=True):
    __tablename__ = "tqf3_artifacts"
    __table_args__ = (UniqueConstraint("section_id", "version", name="uq_tqf3_artifact_section_version"),)

    artifact_id: Optional[int] = Field(default=None, primary_key=True)
    section_id: int = Field(foreign_key="course_sections.section_id", index=True)
    course_id: str = Field(index=True)
    pathway_id: Optional[str] = Field(default=None, index=True)
    course_template_id: Optional[int] = Field(default=None, foreign_key="course_general_info_templates.template_id")
    program_template_id: Optional[int] = Field(default=None, foreign_key="program_templates.template_id")
    status: str = Field(default="draft", index=True)
    version: int = Field(default=1, ge=1)
    artifact_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    reference_snapshot_json: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
