from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import jwt
import bcrypt
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from model.admin import Admin


security = HTTPBearer()


def hash_password(password: str) -> str:
    """
    Hash the password using bcrypt.
    """
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify the password against its hash.
    """
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


def create_access_token(data: dict) -> str:
    """
    Create a JWT token with expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Admin:
    """
    Verify the JWT token and return the current admin.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return Admin.get(Admin.username == username)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
