from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.api.deps import get_db
from app.models.course import Faculty, Program, PLO, Course, CLO, CourseSection
from app.schemas.course import (
    FacultyRead, FacultyCreate,
    ProgramRead, ProgramCreate,
    PLORead, PLOCreate,
    CourseRead, CourseCreate,
    CLORead, CLOCreate,
    CourseSectionRead, CourseSectionCreate, CourseContextCreate
)

router = APIRouter()

# --- Faculties ---
@router.get("/faculties", response_model=List[FacultyRead])
def list_faculties(db: Session = Depends(get_db)):
    return db.exec(select(Faculty)).all()

@router.post("/faculties", response_model=FacultyRead, status_code=status.HTTP_201_CREATED)
def create_faculty(faculty: FacultyCreate, db: Session = Depends(get_db)):
    db_faculty = Faculty.model_validate(faculty)
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty

# --- Programs ---
@router.get("/programs", response_model=List[ProgramRead])
def list_programs(db: Session = Depends(get_db)):
    return db.exec(select(Program)).all()

@router.post("/programs", response_model=ProgramRead, status_code=status.HTTP_201_CREATED)
def create_program(program: ProgramCreate, db: Session = Depends(get_db)):
    db_prog = Program.model_validate(program)
    db.add(db_prog)
    db.commit()
    db.refresh(db_prog)
    return db_prog

# --- PLOs ---
@router.get("/programs/{program_id}/plos", response_model=List[PLORead])
def get_program_plos(program_id: str, db: Session = Depends(get_db)):
    return db.exec(select(PLO).where(PLO.program_id == program_id)).all()

@router.post("/plos", response_model=PLORead, status_code=status.HTTP_201_CREATED)
def create_plo(plo: PLOCreate, db: Session = Depends(get_db)):
    db_plo = PLO.model_validate(plo)
    db.add(db_plo)
    db.commit()
    db.refresh(db_plo)
    return db_plo

# --- Courses ---
@router.get("/courses", response_model=List[CourseRead])
def list_courses(db: Session = Depends(get_db)):
    return db.exec(select(Course)).all()

@router.get("/courses/{course_id}", response_model=CourseRead)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/courses", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    db_course = Course.model_validate(course)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

# --- CLOs ---
@router.get("/courses/{course_id}/clos", response_model=List[CLORead])
def get_course_clos(course_id: str, db: Session = Depends(get_db)):
    return db.exec(select(CLO).where(CLO.course_id == course_id)).all()

@router.post("/clos", response_model=CLORead, status_code=status.HTTP_201_CREATED)
def create_clo(clo: CLOCreate, db: Session = Depends(get_db)):
    db_clo = CLO.model_validate(clo)
    db.add(db_clo)
    db.commit()
    db.refresh(db_clo)
    return db_clo

# --- Course Sections ---
@router.get("/courses/{course_id}/sections", response_model=List[CourseSectionRead])
def get_course_sections(course_id: str, db: Session = Depends(get_db)):
    return db.exec(select(CourseSection).where(CourseSection.course_id == course_id)).all()

@router.post("/sections", response_model=CourseSectionRead, status_code=status.HTTP_201_CREATED)
def create_section(section: CourseSectionCreate, db: Session = Depends(get_db)):
    db_sec = CourseSection.model_validate(section)
    db.add(db_sec)
    db.commit()
    db.refresh(db_sec)
    return db_sec


@router.post("/course-contexts", response_model=CourseSectionRead)
def ensure_course_context(context: CourseContextCreate, db: Session = Depends(get_db)):
    """Ensure the local records required to own a TQF3 artifact.

    Only the selected course is recorded. The external catalogue remains a
    live, read-through source and is never bulk-copied into the database.
    """
    if not db.get(Faculty, "LOCAL"):
        db.add(Faculty(
            faculty_id="LOCAL",
            faculty_name_th="รายวิชาที่อาจารย์จัดการ",
            faculty_name_en="Professor-managed courses",
        ))
        db.flush()

    if not db.get(Program, "PROFESSOR-MANAGED"):
        db.add(Program(
            program_id="PROFESSOR-MANAGED",
            faculty_id="LOCAL",
            program_name_th="บริบทการจัดทำ มคอ.3",
            program_name_en="TQF3 operational course contexts",
            curriculum_year=context.academic_year,
        ))
        db.flush()

    course = db.get(Course, context.course_id)
    if not course:
        course = Course(
            course_id=context.course_id,
            program_id="PROFESSOR-MANAGED",
            course_code_th=context.course_code_th or context.course_code,
            course_name_th=context.course_name_th,
            course_name_en=context.course_name_en,
            credits=context.credits,
            lecture_hours=context.lecture_hours,
            lab_hours=context.lab_hours,
        )
        db.add(course)
        db.flush()

    section = db.exec(
        select(CourseSection)
        .where(CourseSection.course_id == context.course_id)
        .where(CourseSection.section_number == context.section_number)
        .where(CourseSection.semester == context.semester)
        .where(CourseSection.academic_year == context.academic_year)
    ).first()
    if not section:
        section = CourseSection(
            course_id=context.course_id,
            section_number=context.section_number,
            semester=context.semester,
            academic_year=context.academic_year,
        )
        db.add(section)

    db.commit()
    db.refresh(section)
    return section
