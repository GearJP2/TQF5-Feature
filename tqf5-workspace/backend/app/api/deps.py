from typing import Generator
from sqlmodel import Session
from app.core.db import get_session

def get_db() -> Generator[Session, None, None]:
    yield from get_session()
