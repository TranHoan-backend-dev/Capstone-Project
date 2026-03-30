from __future__ import annotations

import os
import sys
from threading import Lock

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from config.settings import Settings
from app.pipeline import OCRPipeline


app = FastAPI(title="YOLO Paddle OCR API", version="1.0.0")

_pipeline: OCRPipeline | None = None
_pipeline_lock = Lock()


def get_pipeline() -> OCRPipeline:
    global _pipeline
    if _pipeline is None:
        with _pipeline_lock:
            if _pipeline is None:
                _pipeline = OCRPipeline(Settings())
    return _pipeline


def decode_image(data: bytes):
    image_array = np.frombuffer(data, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Cannot decode uploaded image")
    return image


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing uploaded file")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    image = decode_image(image_bytes)
    results = get_pipeline().process(image)
    return JSONResponse({"filename": file.filename, "results": results})
