from datetime import datetime
from typing import Any, Dict, Literal, Optional

from pydantic import BaseModel, Field


class ProgramTemplateBase(BaseModel):
    program_id: Optional[str] = None
    curriculum_id: Optional[str] = None
    pathway_id: Optional[str] = None
    template_type: str
    version: str = "1.0"
    content_json: Dict[str, Any] = Field(default_factory=dict)
    active: bool = True


class ProgramTemplateCreate(ProgramTemplateBase):
    pass


class ProgramTemplateUpdate(BaseModel):
    program_id: Optional[str] = None
    curriculum_id: Optional[str] = None
    pathway_id: Optional[str] = None
    template_type: Optional[str] = None
    version: Optional[str] = None
    content_json: Optional[Dict[str, Any]] = None
    active: Optional[bool] = None


class ProgramTemplateRead(ProgramTemplateBase):
    template_id: int
    created_at: datetime
    updated_at: datetime


class CourseGeneralInfoTemplateBase(BaseModel):
    course_id: Optional[str] = None
    program_id: Optional[str] = None
    curriculum_id: Optional[str] = None
    pathway_id: Optional[str] = None
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
    default_instructors_json: Dict[str, Any] = Field(default_factory=dict)
    default_schedule_json: Dict[str, Any] = Field(default_factory=dict)
    active: bool = True


class CourseGeneralInfoTemplateCreate(CourseGeneralInfoTemplateBase):
    pass


class CourseGeneralInfoTemplateUpdate(BaseModel):
    course_id: Optional[str] = None
    program_id: Optional[str] = None
    curriculum_id: Optional[str] = None
    pathway_id: Optional[str] = None
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
    default_instructors_json: Optional[Dict[str, Any]] = None
    default_schedule_json: Optional[Dict[str, Any]] = None
    active: Optional[bool] = None


class CourseGeneralInfoTemplateRead(CourseGeneralInfoTemplateBase):
    template_id: int
    created_at: datetime
    updated_at: datetime


class TQF3ArtifactBase(BaseModel):
    section_id: int = Field(ge=1)
    course_id: str = Field(min_length=1)
    pathway_id: Optional[str] = None
    course_template_id: Optional[int] = None
    program_template_id: Optional[int] = None
    status: Literal["draft", "ready", "approved"] = "draft"
    artifact_json: Dict[str, Any] = Field(default_factory=dict)
    reference_snapshot_json: Dict[str, Any] = Field(default_factory=dict)


class TQF3ArtifactCreate(TQF3ArtifactBase):
    pass


class TQF3ArtifactUpdate(BaseModel):
    status: Optional[Literal["draft", "ready", "approved"]] = None
    artifact_json: Optional[Dict[str, Any]] = None
    reference_snapshot_json: Optional[Dict[str, Any]] = None


class TQF3ArtifactRead(TQF3ArtifactBase):
    artifact_id: int
    # Rows created by the original prototype could be course-level only.
    # New writes require both references, while reads remain compatible.
    section_id: Optional[int] = None
    course_id: Optional[str] = None
    version: int
    created_at: datetime
    updated_at: datetime
