import os
import pyassimp
from fastapi import HTTPException
from config import CONVERTED_FOLDER


def convert_max_to_glb(input_file: str) -> str:
    """
    Convert a .max file to .glb format.
    """
    output_file = os.path.join(
        CONVERTED_FOLDER,
        os.path.splitext(os.path.basename(input_file))[0] + ".glb"
    )
    try:
        scene = pyassimp.load(input_file)
        if not scene:
            raise HTTPException(
                status_code=500, detail="Failed to load .max file")
        pyassimp.export(scene, output_file, "glb2")
        pyassimp.release(scene)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Conversion failed: {str(e)}")
    return output_file
