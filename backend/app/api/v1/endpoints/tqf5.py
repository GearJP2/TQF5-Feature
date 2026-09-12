from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api.deps import get_db
from app.models.tqf5 import TQF5Report, CLOAchievementReport
from app.schemas.tqf5 import (
    TQF5ReportCreate, TQF5ReportRead,
    CLOAchievementCreate, CLOAchievementRead
)

router = APIRouter()

@router.get("/reports", response_model=List[TQF5ReportRead])
def list_tqf5_reports(db: Session = Depends(get_db)):
    reports = db.exec(select(TQF5Report)).all()
    res = []
    for r in reports:
        achievements = db.exec(select(CLOAchievementReport).where(CLOAchievementReport.tqf5_id == r.tqf5_id)).all()
        res.append(TQF5ReportRead(
            tqf5_id=r.tqf5_id,
            section_id=r.section_id,
            summary_student_count=r.summary_student_count,
            dropped_student_count=r.dropped_student_count,
            tqf5_status=r.tqf5_status,
            teaching_problems=r.teaching_problems,
            improvement_plans=r.improvement_plans,
            achievements=[CLOAchievementRead.model_validate(a) for a in achievements]
        ))
    return res

@router.post("/reports", response_model=TQF5ReportRead)
def create_tqf5_report(report: TQF5ReportCreate, db: Session = Depends(get_db)):
    db_rep = TQF5Report.model_validate(report)
    db.add(db_rep)
    db.commit()
    db.refresh(db_rep)
    return TQF5ReportRead(
        tqf5_id=db_rep.tqf5_id,
        section_id=db_rep.section_id,
        summary_student_count=db_rep.summary_student_count,
        dropped_student_count=db_rep.dropped_student_count,
        tqf5_status=db_rep.tqf5_status,
        teaching_problems=db_rep.teaching_problems,
        improvement_plans=db_rep.improvement_plans,
        achievements=[]
    )
