import os

DATABASE_URL = "test.db"
UPLOAD_FOLDER = "uploads"
CONVERTED_FOLDER = "converted"
SECRET_KEY = "your_jwt_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 365 * 24 * 60
AWS_ACCESS_KEY = "your_aws_access_key"
AWS_SECRET_KEY = "your_aws_secret_key"
AWS_BUCKET_NAME = "your_bucket_name"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)
