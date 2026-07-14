from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# In production we would use standard connection pool settings
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency that provides a local database session.
    Automatically closes the connection at the end of the request lifecycle.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
