import mimetypes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from controllers import model_controller
from config import UPLOAD_FOLDER, CONVERTED_FOLDER
from model.database import db
from controllers import admin_controller
from model.admin import Admin
from model.model import CharVariant, Model, Fiber, BgColor


# ✅ Create necessary folders
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

# ✅ Initialize the database
db.connect()
db.create_tables([Admin, Model, Fiber, BgColor, CharVariant])

# ✅ Initialize the app
app = FastAPI(
    title="3D Model Management API",
    description="API for handling models, fibers, and admin authentication.",
    version="1.0.0"

)


# ✅ Enable CORS (optional, for frontend connections)
app.add_middleware(
    CORSMiddleware,
    # Change this to your frontend domain in production
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/static/{filename}")
async def serve_static(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        return FileResponse(file_path, media_type=mime_type)
    return {"error": "File not found"}

# ✅ Include routers
app.include_router(admin_controller.router, prefix="/auth", tags=["Auth"])
app.include_router(admin_controller.router, prefix="/admin", tags=["Admin"])
app.include_router(model_controller.router, prefix="/models", tags=["Models"])
