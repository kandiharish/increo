import os
from pydantic_settings import BaseSettings
from typing import List

# Resolve absolute path to the backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BACKEND_DIR, ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Increo Salary Appraisal API"
    API_V1_STR: str = "/api/v1"
    
    # Database settings
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/increo"
    
    # Security settings
    SECRET_KEY: str = "supersecret_increo_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 Hours
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite standard port
        "http://127.0.0.1:5173",
    ]

    class Config:
        case_sensitive = True
        # Try local .env first, fallback to the absolute backend/.env
        env_file = [".env", ENV_PATH]

settings = Settings()
