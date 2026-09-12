from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import init_db
from app.seed import seed_database
from app.services.legacy_tqf3_migration import backfill_legacy_tqf3_artifacts
from app.core.db import engine
from sqlmodel import Session
from app.api.v1.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_database()
    with Session(engine) as db:
        backfill_legacy_tqf3_artifacts(db)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/")
def root():
    return {
        "message": "Welcome to CSTU Academic Portal API",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}

app.include_router(api_router, prefix=settings.API_V1_STR)
