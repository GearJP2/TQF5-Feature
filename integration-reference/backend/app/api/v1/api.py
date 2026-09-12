from fastapi import APIRouter

from app.api.v1.endpoints import (
    clo_quality_agent,
    courses,
    curriculum_reference,
    export,
    mapper_agent,
    tqf3,
    tqf3_assets,
    tqf3_draft_agent,
    tqf5,
)

api_router = APIRouter()

api_router.include_router(courses.router, tags=["Courses & Curriculum"])
api_router.include_router(
    curriculum_reference.router,
    prefix="/curriculum-reference",
    tags=["Curriculum Reference"],
)
api_router.include_router(tqf3.router, prefix="/tqf3", tags=["TQF3 Reports"])
api_router.include_router(tqf3_assets.router, prefix="/tqf3-assets", tags=["TQF3 Assets"])
api_router.include_router(tqf5.router, prefix="/tqf5", tags=["TQF5 Reports"])
api_router.include_router(export.router, prefix="/export", tags=["Export Services"])
api_router.include_router(mapper_agent.router, prefix="/agent", tags=["AI Agents"])
api_router.include_router(tqf3_draft_agent.router, prefix="/agent", tags=["AI Agents"])
api_router.include_router(clo_quality_agent.router, prefix="/agent", tags=["AI Agents"])
