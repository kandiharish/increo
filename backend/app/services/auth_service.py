from sqlalchemy.orm import Session
from app.repositories.user_repo import UserRepository
from app.auth.security import verify_password
from app.models.user import User
from typing import Optional

class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Verify user credentials. Returns the User database object if correct, 
        else None.
        """
        user = self.user_repo.get_by_email(email)
        if not user:
            return None
        
        # Check active status
        if user.status != "Active":
            return None
            
        # Verify hashed password
        if not verify_password(password, user.password_hash):
            return None
            
        return user
