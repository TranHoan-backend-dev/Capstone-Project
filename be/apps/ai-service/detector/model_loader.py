import pathlib
import platform
import os
from typing import Iterable

if platform.system() == "Windows":
    pathlib.PosixPath = pathlib.WindowsPath

import torch
from torch import nn


def _quantize_modules(model, module_types: Iterable[type]) -> None:
    try:
        model.model = torch.quantization.quantize_dynamic(
            model.model,
            set(module_types),
            dtype=torch.qint8,
        )
    except Exception:
        # Keep the original model if dynamic quantization is unsupported.
        return


def load_yolo(weights_path: str, device: str = "", quantize: bool = False):
    repo_or_dir = os.getenv("YOLO_REPO_PATH", "").strip() or "ultralytics/yolov5"
    source = "local" if os.path.isdir(repo_or_dir) else "github"

    model = torch.hub.load(
        repo_or_dir,
        "custom",
        path=weights_path,
        source=source,
    )
    if device:
        model.to(device)

    # Only attempt dynamic quantization on CPU to avoid changing CUDA behavior.
    if quantize and (not device or device.lower() == "cpu"):
        _quantize_modules(model, {nn.Linear})

    model.eval()
    return model
