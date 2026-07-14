from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database.session import get_db
from app.schemas.auth import LoginRequest, Token, UserMeResponse
from app.services.auth_service import AuthService
from app.auth.jwt import create_access_token
from app.api.v1.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user and return a JWT access token.
    """
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(email=login_data.email, password=login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create Access Token
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.name})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role.name,
        "full_name": user.full_name
    }

@router.post("/login/form", response_model=Token, include_in_schema=False)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Form-based login endpoint to support FastAPI Swagger UI interactive lock client.
    """
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.name})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role.name,
        "full_name": user.full_name
    }

@router.get("/me", response_model=UserMeResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Return the active user profile details.
    """
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.name,
        "status": current_user.status
    }
