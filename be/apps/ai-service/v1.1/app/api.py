from __future__ import annotations

import os
import sys
from threading import Lock
from typing import Literal

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

DetectionLabel = Literal[
    "meter",
    "Serial_number_region",
    "Current_pointer_reading_region",
]


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
    box: list[int] = Field(
        ...,
        description=(
            "Bounding box in pixel coordinates on the original image, "
            "formatted as [x1, y1, x2, y2]."
        ),
        examples=[[272, 492, 684, 565]],
    )
    label: DetectionLabel = Field(
        ...,
        description=(
            "Detected region type. "
            "`meter` = whole meter face, "
            "`Serial_number_region` = serial number area, "
            "`Current_pointer_reading_region` = current meter reading area."
        ),
        examples=["Current_pointer_reading_region"],
    )
    text: str = Field(
        ...,
        description=(
            "Final OCR text after post-processing. "
            "Clients should use this field as the main output value."
        ),
        examples=["00088"],
    )
    conf: float | None = Field(
        default=None,
        description=(
            "Confidence used for detections that do not apply OCR confidence fusion, "
            "typically the `meter` region."
        ),
        examples=[0.974],
    )
    yolo_conf: float | None = Field(
        default=None,
        description="YOLO detection confidence for this returned region.",
        examples=[0.824],
    )
    reading_yolo_conf: float | None = Field(
        default=None,
        description="YOLO detection confidence of the reading-region box. Only populated for the reading region.",
        examples=[0.823],
    )
    decimal_yolo_conf: float | None = Field(
        default=None,
        description="YOLO detection confidence of the matched decimal-region box. Only populated for the reading region.",
        examples=[0.912],
    )
    ocr_conf: float | None = Field(
        default=None,
        description="Highest PaddleOCR confidence among raw OCR candidates for this region.",
        examples=[0.96],
    )
    heuristic: float | None = Field(
        default=None,
        description="Internal rule-based score used to support OCR result validation.",
        examples=[0.75],
    )
    final_conf: float | None = Field(
        default=None,
        description="Final fused confidence after combining YOLO, OCR confidence, and heuristic scores.",
        examples=[0.837],
    )
    raw_texts: list[list[str | float]] = Field(
        default_factory=list,
        description=(
            "Raw OCR outputs before post-processing. "
            "Each item is formatted as [text, confidence]. "
            "Primarily intended for debugging or analysis."
        ),
        examples=[[["0008879", 0.9598]]],
    )


class PredictResponse(BaseModel):
    filename: str = Field(
        ...,
        description="Original filename from the uploaded multipart file.",
        example="test.jpg",
    )
    results: list[PredictionItem] = Field(
        ...,
        description=(
            "Detected regions in the image. "
            "Consumers should identify the desired value by the `label` field, "
            "not by assuming a fixed array order."
        ),
    )


class ReadingCropProbeResponse(BaseModel):
    label: Literal["Current_pointer_reading_region"] = Field(
        ...,
        description="Fixed label for OCR-only reading-crop probes.",
        example="Current_pointer_reading_region",
    )
    text: str = Field(
        ...,
        description="Reading text obtained by running OCR directly on the supplied crop.",
        example="00088",
    )
    ocr_conf: float = Field(
        ...,
        description="Highest PaddleOCR confidence found on the supplied crop.",
        example=0.973,
    )
    heuristic: float = Field(
        ...,
        description="Reading heuristic score computed without detector involvement.",
        example=1.0,
    )
    final_conf: float = Field(
        ...,
        description="OCR-only confidence score for the supplied crop.",
        example=0.979,
    )
    raw_texts: list[list[str | float]] = Field(
        default_factory=list,
        description="Raw OCR outputs before reading post-processing.",
        examples=[[["00088", 0.9727]]],
    )


class ErrorResponse(BaseModel):
    detail: str = Field(
        ...,
        description="Human-readable error message describing why the request failed.",
        examples=["Missing uploaded file"],
    )


app = FastAPI(
    title="YOLO Paddle OCR API",
    version="1.0.0",
    description=(
        "AI service for water meter reading recognition. "
        "The service detects meter-related regions with YOLOv5 and reads text with PaddleOCR. "
        "Spring Boot or mobile clients should upload an image to `/predict` and consume the returned JSON."
    ),
    openapi_tags=[
        {
            "name": "service",
            "description": "Operational endpoints used to verify that the AI service is running.",
        },
        {
            "name": "prediction",
            "description": "Endpoints for uploading meter images and receiving OCR results.",
        },
    ],
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
    tags=["service"],
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
    tags=["service"],
    summary="Health check",
    description="Used by Spring Boot, Docker, or monitoring systems to verify that the AI service is alive.",
)
def health():
    return HealthResponse(status="ok")


@app.post(
    "/predict",
    response_model=PredictResponse,
    tags=["prediction"],
    summary="Predict meter reading from an uploaded image",
    description=(
        "Accepts one image file as `multipart/form-data`, runs YOLOv5 region detection and PaddleOCR, "
        "then returns detected regions, OCR text, and confidence-related fields.\n\n"
        "### Request contract\n"
        "- Content-Type: `multipart/form-data`\n"
        "- Required form field: `file`\n"
        "- Supported image formats depend on OpenCV, typically `jpg`, `jpeg`, `png`\n\n"
        "### Response contract\n"
        "- `filename`: original uploaded filename\n"
        "- `results`: list of detected regions\n"
        "- Each region should be read by `label`, not by array index\n\n"
        "### Label meanings\n"
        "- `meter`: whole meter face\n"
        "- `Serial_number_region`: serial number area\n"
        "- `Current_pointer_reading_region`: current meter reading area after cutting off the matched decimal region\n\n"
        "### Integration note\n"
        "Spring Boot should usually consume `text` as the business value and `final_conf` as the confidence score."
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
                                "text": "00088",
                                "conf": None,
                                "yolo_conf": 0.824,
                                "reading_yolo_conf": 0.823,
                                "decimal_yolo_conf": 0.912,
                                "ocr_conf": 0.986,
                                "heuristic": 0.5,
                                "final_conf": 0.837,
                                "raw_texts": [["00088", 0.966]],
                            },
                        ],
                    }
                }
            },
        },
        400: {
            "model": ErrorResponse,
            "description": "Uploaded file is missing, empty, or cannot be decoded.",
            "content": {
                "application/json": {
                    "examples": {
                        "missing_file": {"summary": "Missing file", "value": {"detail": "Missing uploaded file"}},
                        "empty_file": {"summary": "Empty file", "value": {"detail": "Uploaded file is empty"}},
                        "decode_error": {
                            "summary": "Decode failure",
                            "value": {"detail": "Cannot decode uploaded image"},
                        },
                    }
                }
            },
        },
        500: {
            "model": ErrorResponse,
            "description": "Internal server error while loading models or running OCR inference.",
        },
    },
)
async def predict(
    file: UploadFile = File(
        ...,
        description=(
            "Input meter image sent as multipart/form-data. "
            "Use the form field name `file`."
        ),
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


@app.post(
    "/debug/reading-crop-ocr",
    response_model=ReadingCropProbeResponse,
    tags=["prediction"],
    summary="Run OCR directly on a reading crop",
    description=(
        "Debug endpoint that bypasses YOLO detection entirely. "
        "Use it to evaluate PaddleOCR + reading post-processing on an already-cropped "
        "meter-reading image region."
    ),
    responses={
        400: {
            "model": ErrorResponse,
            "description": "Uploaded file is missing, empty, or cannot be decoded.",
        },
        500: {
            "model": ErrorResponse,
            "description": "Internal server error while running OCR inference.",
        },
    },
)
async def debug_reading_crop_ocr(
    file: UploadFile = File(
        ...,
        description="Reading crop image sent as multipart/form-data under the field name `file`.",
    )
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing uploaded file")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    image = decode_image(image_bytes)
    result = get_pipeline().process_reading_crop(image)
    return JSONResponse(result)
