from fastapi import HTTPException, status
from uuid import uuid4
from fastapi import APIRouter, Form, UploadFile, File, HTTPException, Depends
from typing import List, Optional
import os
import shutil
from playhouse.shortcuts import model_to_dict
from model.model import CharVariant, Model, Fiber, BgColor
from utils.auth import get_current_admin
# from utils.converter import convert_max_to_glb
from config import UPLOAD_FOLDER

router = APIRouter()


@router.post("/create_with_fibers/")
def create_model_with_fibers(
    name: str = Form(...),
    bg: str = Form(...),
    model_file: UploadFile = File(...),
    fiber_files: List[UploadFile] = File(...),
    thumbnail: UploadFile = File(...),
    variant_files: Optional[List[UploadFile]] = File(None),
    affected_meshes: Optional[List[str]] = Form(None),  # ✅ New parameter
    admin=Depends(get_current_admin)
):
    # Save and upload model file
    model_uuid = uuid4()
    model_file_location = f"{UPLOAD_FOLDER}/{model_uuid}_{model_file.filename}"
    with open(model_file_location, "wb") as buffer:
        shutil.copyfileobj(model_file.file, buffer)

    # Save and upload thumbnail
    thumbnail_uuid = uuid4()
    thumbnail_file_location = f"{UPLOAD_FOLDER}/{thumbnail_uuid}_{thumbnail.filename}"
    with open(thumbnail_file_location, "wb") as buffer:
        shutil.copyfileobj(thumbnail.file, buffer)

    # Create model record
    model = Model.create(
        name=name,
        file_path=f"/static/{model_uuid}_{model_file.filename}",
        thumbnail_path=f"/static/{thumbnail_uuid}_{thumbnail.filename}",
        # ✅ Store affected meshes
        affected_meshes=",".join(affected_meshes) if affected_meshes else None
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
        fiber = Fiber.create(
            image_path=f"/static/{fiber_uuid}_{fiber_file.filename}", model=model)
        fibers.append(fiber)

    # Upload char variants (L1, L2, L3)
    char_variants = []
    variant_names = ["L1", "L2", "L3"]
    if variant_files:
        for idx, variant_file in enumerate(variant_files):
            variant_uuid = uuid4()
            variant_file_location = f"{UPLOAD_FOLDER}/{variant_uuid}_{variant_file.filename}"
            with open(variant_file_location, "wb") as buffer:
                shutil.copyfileobj(variant_file.file, buffer)
            char_variant = CharVariant.create(
                name=f"L{idx}" if idx < len(
                    variant_names) else f"Extra_{idx+1}",
                file_path=f"/static/{variant_uuid}_{variant_file.filename}",
                description=f"Extra_{idx+1} variation",
                model=model
            )
            char_variants.append(char_variant)

    return {
        "model": model.__data__,
        "fibers": [fiber.__data__ for fiber in fibers],
        "char_variants": [variant.__data__ for variant in char_variants],
        "affected_meshes": affected_meshes or []
    }


@router.get("/")
def get_models():
    models = []
    for model in Model.select():
        model_data = model.__data__.copy()
        model_data["bg_colors"] = [bg.color_code for bg in model.bg_colors]
        model_data["fibers"] = [fiber.image_path for fiber in model.fibers]

        # ✅ Convert affected_meshes back to a list
        model_data["affected_meshes"] = (
            model.affected_meshes.split(",") if model.affected_meshes else []
        )

        models.append(model_data)

    return models


@router.get("/fibers/")
def get_fibers():
    return [fiber.__data__ for fiber in Fiber.select()]


@router.get("/{id}")
def get_model_by_id(id: int):
    try:
        models = Model.select().where(Model.id == id).prefetch(BgColor, Fiber, CharVariant)
        model = next(iter(models))  # Get the first (and only) result
        model_dict = model_to_dict(model, backrefs=True)
    except StopIteration:
        raise HTTPException(status_code=404, detail="Model not found")
    return model_dict


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


@router.delete("/delete/{model_id}/")
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
