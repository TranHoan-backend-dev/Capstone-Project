from __future__ import annotations

from dataclasses import dataclass
import json
import os
from pathlib import Path
from typing import Any, Dict, Union


_CONFIG_PATH = Path(__file__).with_name("config.json")


def _load_config() -> Dict[str, Any]:
    if not _CONFIG_PATH.exists():
        return {}
    try:
        with _CONFIG_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


_CONFIG = _load_config()


def _cfg(name: str, default: Any) -> Any:
    return _CONFIG.get(name, default)


def _env_str(name: str, default: str) -> str:
    value = os.getenv(name)
    return value if value is not None and value != "" else default


def _env_float(name: str, default: float) -> float:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    try:
        return float(value)
    except ValueError:
        return default


def _env_int(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    try:
        return int(value)
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


def _parse_video_source(value: str) -> Union[int, str]:
    value = value.strip()
    if value.isdigit():
        return int(value)
    return value


@dataclass(frozen=True)
class Settings:
    # Model weights
    yolo_weights_path: str = _env_str(
        "YOLO_WEIGHTS_PATH", _cfg("yolo_weights_path", "models/yolov5s.pt")
    )

    # YOLO inference params
    yolo_conf: float = _env_float("YOLO_CONF", _cfg("yolo_conf", 0.25))
    yolo_iou: float = _env_float("YOLO_IOU", _cfg("yolo_iou", 0.45))
    yolo_device: str = _env_str("YOLO_DEVICE", _cfg("yolo_device", "cpu"))
    yolo_img_size: int = _env_int("YOLO_IMG_SIZE", _cfg("yolo_img_size", 0))
    yolo_batch_size: int = _env_int("YOLO_BATCH_SIZE", _cfg("yolo_batch_size", 1))
    yolo_quantize: bool = _env_bool("YOLO_QUANTIZE", _cfg("yolo_quantize", False))

    # OCR params
    ocr_lang: str = _env_str("OCR_LANG", _cfg("ocr_lang", "en"))
    ocr_use_angle_cls: bool = _env_bool(
        "OCR_USE_ANGLE_CLS", _cfg("ocr_use_angle_cls", True)
    )
    ocr_use_det: bool = _env_bool("OCR_USE_DET", _cfg("ocr_use_det", False))

    # Crop filtering
    crop_min_width: int = _env_int("CROP_MIN_WIDTH", _cfg("crop_min_width", 8))
    crop_min_height: int = _env_int("CROP_MIN_HEIGHT", _cfg("crop_min_height", 8))

    # Realtime video
    video_source: Union[int, str] = _parse_video_source(
        _env_str("VIDEO_SOURCE", str(_cfg("video_source", "0")))
    )
    frame_stride: int = _env_int(
        "FRAME_STRIDE", _cfg("frame_stride", 1)
    )  # process every Nth frame
    frame_max_width: int = _env_int(
        "FRAME_MAX_WIDTH", _cfg("frame_max_width", 1280)
    )  # 0 = no resize

    # UI
    window_name: str = _env_str("WINDOW_NAME", _cfg("window_name", "YOLOv5 + PaddleOCR"))
    quit_key: str = _env_str("QUIT_KEY", _cfg("quit_key", "q"))
    max_label_len: int = _env_int("MAX_LABEL_LEN", _cfg("max_label_len", 80))
