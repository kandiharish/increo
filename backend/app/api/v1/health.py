from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.session import get_db

router = APIRouter()

@router.get("/health", tags=["health"])
def health_check(db: Session = Depends(get_db)):
    """
    Verify application health and database connection.
    """
    try:
        # Perform simple query check on database
        db.execute(text("SELECT 1"))
        return {
            "success": True,
            "status": "healthy",
            "database": "connected",
            "message": "Increo API is healthy and database connection is active."
        }
    except Exception as e:
        return {
            "success": False,
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "message": "Increo API is unhealthy. Database connection failed."
        }
