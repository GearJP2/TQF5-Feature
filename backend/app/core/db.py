from typing import Generator
from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# SQLite connection args check
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args
)

def init_db() -> None:
    """Create all SQLModel tables in database."""
    import app.models  # noqa: F401

    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency to provide DB session per request."""
    with Session(engine) as session:
        yield session
