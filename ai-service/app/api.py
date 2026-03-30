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
from pydantic import BaseModel, Field

from config.settings import Settings
from app.pipeline import OCRPipeline


class RootResponse(BaseModel):
    service: str = Field(..., example="YOLO Paddle OCR API")
    version: str = Field(..., example="1.0.0")
    status: str = Field(..., example="running")
    docs_url: str = Field(..., example="/docs")
    health_url: str = Field(..., example="/health")
    predict_url: str = Field(..., example="/predict")


class HealthResponse(BaseModel):
    status: str = Field(..., example="ok")


class PredictionItem(BaseModel):
    box: list[int] = Field(..., description="Bounding box in format [x1, y1, x2, y2].")
    label: str = Field(..., description="Detected class label.")
    text: str = Field(..., description="OCR text after post-processing.")
    conf: float | None = Field(
        default=None,
        description="Confidence for detections that do not use OCR confidence fusion, e.g. meter region.",
    )
    yolo_conf: float | None = Field(default=None, description="YOLO detection confidence.")
    ocr_conf: float | None = Field(default=None, description="Best OCR confidence from PaddleOCR.")
    heuristic: float | None = Field(default=None, description="Heuristic score used in the final confidence.")
    final_conf: float | None = Field(default=None, description="Final fused confidence score.")
    raw_texts: list[list[str | float]] = Field(
        default_factory=list,
        description="Raw OCR outputs in format [text, confidence].",
    )


class PredictResponse(BaseModel):
    filename: str = Field(..., example="test.jpg")
    results: list[PredictionItem]


app = FastAPI(
    title="YOLO Paddle OCR API",
    version="1.0.0",
    description=(
        "AI service for water meter reading recognition. "
        "The service detects meter-related regions with YOLOv5 and reads text with PaddleOCR. "
        "Spring Boot or mobile clients should upload an image to `/predict` and consume the returned JSON."
    ),
)

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


@app.get(
    "/",
    response_model=RootResponse,
    summary="Service information",
    description="Quick entrypoint describing the service status and the available API routes.",
)
def root():
    return RootResponse(
        service="YOLO Paddle OCR API",
        version=app.version,
        status="running",
        docs_url="/docs",
        health_url="/health",
        predict_url="/predict",
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Used by Spring Boot, Docker, or monitoring systems to verify that the AI service is alive.",
)
def health():
    return HealthResponse(status="ok")


@app.post(
    "/predict",
    response_model=PredictResponse,
    summary="Predict meter reading from an uploaded image",
    description=(
        "Accepts one image file as multipart/form-data, runs YOLOv5 region detection and PaddleOCR, "
        "then returns detected regions, OCR text, and confidence-related fields."
    ),
    responses={
        200: {
            "description": "Prediction completed successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "filename": "test.jpg",
                        "results": [
                            {
                                "box": [184, 317, 811, 952],
                                "label": "meter",
                                "text": "",
                                "conf": 0.973,
                                "yolo_conf": None,
                                "ocr_conf": None,
                                "heuristic": None,
                                "final_conf": None,
                                "raw_texts": [],
                            },
                            {
                                "box": [258, 472, 721, 583],
                                "label": "Current_pointer_reading_region",
                                "text": "0008879",
                                "conf": None,
                                "yolo_conf": 0.763,
                                "ocr_conf": 0.986,
                                "heuristic": 0.5,
                                "final_conf": 0.837,
                                "raw_texts": [["0008879", 0.966], ["M3", 0.986]],
                            },
                        ],
                    }
                }
            },
        },
        400: {"description": "Uploaded file is missing, empty, or cannot be decoded."},
    },
)
async def predict(
    file: UploadFile = File(
        ...,
        description="Input meter image. Supported formats depend on OpenCV, typically jpg/png/jpeg.",
    )
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing uploaded file")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    image = decode_image(image_bytes)
    results = get_pipeline().process(image)
    return JSONResponse({"filename": file.filename, "results": results})
