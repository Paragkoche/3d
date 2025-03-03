from fastapi import HTTPException, status
from uuid import uuid4
from fastapi import APIRouter, Form, UploadFile, File, HTTPException, Depends
from typing import List
import os
import shutil

from model.model import Model, Fiber, BgColor
from utils.auth import get_current_admin
# from utils.converter import convert_max_to_glb
from utils.s3 import upload_to_s3
from config import UPLOAD_FOLDER

router = APIRouter()


@router.post("/create_with_fibers/")
def create_model_with_fibers(
    name: str = Form(...),
    bg: str = Form(...),
    model_file: UploadFile = File(...),
    fiber_files: List[UploadFile] = File(...),
    thumbnail: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    # Save and upload model file
    model_uuid = uuid4()
    model_file_location = f"{UPLOAD_FOLDER}/{model_uuid}_{model_file.filename}"
    with open(model_file_location, "wb") as buffer:
        shutil.copyfileobj(model_file.file, buffer)
    # model_s3_url = upload_to_s3(
    #     model_file_location, f"models/{os.path.basename(model_file_location)}")

    # Save and upload thumbnail
    thumbnail_uuid = uuid4()
    thumbnail_file_location = f"{UPLOAD_FOLDER}/{thumbnail_uuid}_{thumbnail.filename}"
    with open(thumbnail_file_location, "wb") as buffer:
        shutil.copyfileobj(thumbnail.file, buffer)
    # thumbnail_s3_url = upload_to_s3(
    #     thumbnail_file_location, f"thumbnails/{thumbnail.filename}")

    # Create model record with thumbnail
    model = Model.create(
        name=name,
        file_path=f"/static/{model_uuid}_{model_file.filename}",
        # Assuming this field exists in your Model
        thumbnail_path=f"/static/{thumbnail_uuid}_{thumbnail.filename}"
    )

    # Add background colors
    for color_code in bg.split(","):
        BgColor.create(color_code=color_code.strip(), model=model)

    # Upload fibers
    fibers = []
    for fiber_file in fiber_files:
        fiber_uuid = uuid4()
        fiber_file_location = f"{UPLOAD_FOLDER}/{fiber_uuid}_{fiber_file.filename}"
        with open(fiber_file_location, "wb") as buffer:
            shutil.copyfileobj(fiber_file.file, buffer)
        # fiber_s3_url = upload_to_s3(
        #     fiber_file_location, f"fibers/{fiber_file.filename}")
        fiber = Fiber.create(
            image_path=f"/static/{fiber_uuid}_{fiber_file.filename}", model=model)
        fibers.append(fiber)

    return {
        "model": model.__data__,
        "fibers": [fiber.__data__ for fiber in fibers]
    }


@router.get("/")
def get_models():
    models = []
    for model in Model.select():
        model_data = model.__data__.copy()
        model_data["bg_colors"] = [bg.color_code for bg in model.bg_colors]
        model_data["fibers"] = [fiber.image_path for fiber in model.fibers]
        models.append(model_data)
    return models


@router.get("/fibers/")
def get_fibers():
    return [fiber.__data__ for fiber in Fiber.select()]


@router.put("/{model_id}/")
def update_model(
    model_id: int,
    name: str = Form(None),
    bg: str = Form(None),
    model_file: UploadFile = File(None),
    thumbnail: UploadFile = File(None),
    admin=Depends(get_current_admin)
):
    print(model_id)
    try:
        model = Model.get_by_id(model_id)
    except Model.DoesNotExist:
        raise HTTPException(status_code=404, detail="Model not found")

    # Update name
    if name:
        model.name = name

    # Update model file
    if model_file:
        model_uuid = uuid4()
        model_file_location = f"{UPLOAD_FOLDER}/{model_uuid}_{model_file.filename}"
        with open(model_file_location, "wb") as buffer:
            shutil.copyfileobj(model_file.file, buffer)
        # model_s3_url = upload_to_s3(...)
        model.file_path = f"/static/{model_uuid}_{model_file.filename}"

    # Update thumbnail
    if thumbnail:
        thumbnail_uuid = uuid4()
        thumbnail_file_location = f"{UPLOAD_FOLDER}/{thumbnail_uuid}_{thumbnail.filename}"
        with open(thumbnail_file_location, "wb") as buffer:
            shutil.copyfileobj(thumbnail.file, buffer)
        # thumbnail_s3_url = upload_to_s3(...)
        model.thumbnail_path = f"/static/{thumbnail_uuid}_{thumbnail.filename}"

    model.save()
    # print(bg)
    # # Update background colors (replace existing)
    # if bg:
    #     model.bg_colors.execute().delete()
    #     for color_code in bg.split(","):
    #         BgColor.create(color_code=color_code.strip(), model=model)

    return {"detail": "Model updated successfully", "model": model.__data__}


@router.delete("/{model_id}/")
def delete_model(
    model_id: int,
    admin=Depends(get_current_admin)
):
    try:
        model = Model.get_by_id(model_id)
    except Model.DoesNotExist:
        raise HTTPException(status_code=404, detail="Model not found")

    # Delete related fibers
    for fiber in model.fibers:
        fiber.delete_instance()
        # Optionally delete files from disk/S3 here.

    # Delete related background colors
    for bg in model.bg_colors:
        bg.delete_instance()

    # Optionally delete model and thumbnail files from disk/S3 here.

    model.delete_instance()
    return {"detail": "Model and related data deleted successfully"}
