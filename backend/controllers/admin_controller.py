from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from model.admin import Admin
from utils.auth import hash_password, verify_password, create_access_token
from schemas.admin import AdminLogin
import jwt
from config import SECRET_KEY, ALGORITHM

router = APIRouter()
security = HTTPBearer()


@router.post("/login")
def login(admin_login: AdminLogin):
    try:
        admin = Admin.get(Admin.username == admin_login.username)
        if not verify_password(admin_login.password, admin.password_hash):
            raise HTTPException(
                status_code=401, detail="Incorrect username or password")
        access_token = create_access_token(data={"sub": admin.username})
        return {"access_token": access_token, "token_type": "bearer"}
    except Admin.DoesNotExist:
        raise HTTPException(
            status_code=401, detail="Incorrect username or password")


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return Admin.get(Admin.username == username)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


class CreateAdminRequest(BaseModel):
    username: str
    password: str


@router.post("/create_admin")
def create_admin(
    data: CreateAdminRequest,
):
    if Admin.select().where(Admin.username == data.username).exists():
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = hash_password(data.password)
    admin = Admin.create(username=data.username, password_hash=hashed_password)
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}
