import os

DATABASE_URL = "test.db"
UPLOAD_FOLDER = "uploads"
CONVERTED_FOLDER = "uploads"
SECRET_KEY = "your_jwt_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 365 * 24 * 60


os.makedirs(UPLOAD_FOLDER, exist_ok=True)
