import os
import json
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union

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
    
    # CORS settings — accepts a JSON array string, a comma-separated string, or a list
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite standard port
        "http://127.0.0.1:5173",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """
        Robustly parse BACKEND_CORS_ORIGINS from whatever format Render injects.
        Accepts:
          - A Python list (already parsed)
          - A JSON array string: '["https://app.vercel.app", "http://localhost:5173"]'
          - A comma-separated string: 'https://app.vercel.app,http://localhost:5173'
        """
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            # Try JSON array first
            if v.startswith("["):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass
            # Fall back to comma-separated
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        raise ValueError(f"Invalid BACKEND_CORS_ORIGINS value: {v}")

    class Config:
        case_sensitive = True
        # Try local .env first, fallback to the absolute backend/.env
        env_file = [".env", ENV_PATH]

settings = Settings()

# Log loaded CORS origins at startup for traceability on Render
print(f"[CORS] Allowed origins: {settings.BACKEND_CORS_ORIGINS}")

