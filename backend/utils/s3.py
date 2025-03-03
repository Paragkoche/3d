import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import HTTPException
from config import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME

# Initialize S3 client
s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)


def upload_to_s3(file_path: str, s3_path: str) -> str:
    """
    Upload a file to S3 and return the S3 URL.
    """
    try:
        s3.upload_file(file_path, AWS_BUCKET_NAME, s3_path)
        return f"https://{AWS_BUCKET_NAME}.s3.amazonaws.com/{s3_path}"
    except NoCredentialsError:
        raise HTTPException(
            status_code=500, detail="S3 credentials not available")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"S3 upload failed: {str(e)}")
