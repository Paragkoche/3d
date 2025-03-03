from pydantic import BaseModel
from typing import List


class BgColorSchema(BaseModel):
    color_code: str


class FiberSchema(BaseModel):
    image_path: str


class ModelSchema(BaseModel):
    id: int
    name: str
    file_path: str
    bg_colors: List[BgColorSchema]
    fibers: List[FiberSchema]

    class Config:
        orm_mode = True
