from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np


@dataclass(frozen=True)
class BuildConfig:
    images_dir: Path
    data_csv: Path
    output_dir: Path
    integer_slots: int = 5
    total_slots: int = 8
    digit_size: int = 32
    pad_x_ratio: float = 0.06
    pad_y_ratio: float = 0.20


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Build a digit-classification dataset from meter images and data.csv "
            "without extra manual labeling."
        )
    )
    parser.add_argument("--images-dir", type=Path, required=True, help="Folder containing source meter images.")
    parser.add_argument("--data-csv", type=Path, required=True, help="CSV file containing photo_name, value, and polygon location.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\digit_dataset"),
        help="Destination folder for the generated digit dataset.",
    )
    parser.add_argument("--integer-slots", type=int, default=5, help="Visible black-digit slots before the decimal part.")
    parser.add_argument("--total-slots", type=int, default=8, help="Total reading slots, used for ratio fallback when red detection fails.")
    parser.add_argument("--digit-size", type=int, default=32, help="Saved digit image size.")
    return parser.parse_args()


def parse_polygon_bounds(location: str, width: int, height: int) -> tuple[int, int, int, int] | None:
    matches = re.findall(r"'x':\s*([0-9.]+),\s*'y':\s*([0-9.]+)", location or "")
    if not matches:
        return None

    xs = [float(x) * width for x, _ in matches]
    ys = [float(y) * height for _, y in matches]
    return (
        int(np.floor(min(xs))),
        int(np.floor(min(ys))),
        int(np.ceil(max(xs))),
        int(np.ceil(max(ys))),
    )


def expected_integer_string(value: str, integer_slots: int) -> str | None:
    integer_part = re.split(r"[.,]", value, maxsplit=1)[0]
    digits = re.sub(r"[^0-9]", "", integer_part)
    if not digits:
        return None
    if len(digits) > integer_slots:
        return None
    return digits.zfill(integer_slots)


def deterministic_split(name: str) -> str:
    digest = hashlib.sha1(name.encode("utf-8")).hexdigest()
    bucket = int(digest[:8], 16) % 10
    if bucket < 8:
        return "train"
    if bucket == 8:
        return "val"
    return "test"


def imread_unicode(path: Path) -> np.ndarray | None:
    """
    OpenCV on Windows can fail on Unicode paths.
    Read bytes first, then decode with cv2.imdecode.
    """
    try:
        buffer = np.fromfile(str(path), dtype=np.uint8)
    except OSError:
        return None

    if buffer.size == 0:
        return None

    return cv2.imdecode(buffer, cv2.IMREAD_COLOR)


def detect_decimal_start(crop: np.ndarray, integer_slots: int, total_slots: int) -> tuple[int, str]:
    """
    Find where the red decimal section begins.

    Strategy:
    - First try color detection for red digits.
    - If that fails, fall back to the expected geometry ratio (5/8 of the reading window).
    """
    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)

    lower_red_1 = np.array([0, 70, 60], dtype=np.uint8)
    upper_red_1 = np.array([15, 255, 255], dtype=np.uint8)
    lower_red_2 = np.array([165, 70, 60], dtype=np.uint8)
    upper_red_2 = np.array([180, 255, 255], dtype=np.uint8)

    mask_hsv = cv2.inRange(hsv, lower_red_1, upper_red_1) | cv2.inRange(hsv, lower_red_2, upper_red_2)

    b, g, r = cv2.split(crop)
    mask_rgb = ((r.astype(np.int16) - g.astype(np.int16)) > 35) & ((r.astype(np.int16) - b.astype(np.int16)) > 25)
    mask_rgb = (mask_rgb.astype(np.uint8)) * 255

    mask = cv2.bitwise_or(mask_hsv, mask_rgb)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3, 3), dtype=np.uint8))

    column_score = mask.mean(axis=0)
    threshold = max(8.0, float(mask.mean()) * 1.8)
    red_columns = np.where(column_score > threshold)[0]

    if red_columns.size > 0:
        decimal_start = int(red_columns.min())
        if decimal_start > crop.shape[1] * 0.35:
            return decimal_start, "red_mask"

    fallback = int(round(crop.shape[1] * (integer_slots / max(total_slots, 1))))
    fallback = max(1, min(crop.shape[1] - 1, fallback))
    return fallback, "ratio_fallback"


def normalize_digit_cell(cell: np.ndarray, digit_size: int) -> np.ndarray:
    if cell.size == 0 or cell.shape[0] == 0 or cell.shape[1] == 0:
        return np.zeros((digit_size, digit_size), dtype=np.uint8)

    gray = cv2.cvtColor(cell, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    coords = cv2.findNonZero(thresh)

    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        margin = 2
        x1 = max(0, x - margin)
        y1 = max(0, y - margin)
        x2 = min(gray.shape[1], x + w + margin)
        y2 = min(gray.shape[0], y + h + margin)
        gray = gray[y1:y2, x1:x2]

    h, w = gray.shape[:2]
    if h == 0 or w == 0:
        return np.zeros((digit_size, digit_size), dtype=np.uint8)

    scale = min((digit_size - 6) / max(w, 1), (digit_size - 6) / max(h, 1))
    scale = max(scale, 1e-6)
    new_w = min(digit_size, max(1, int(round(w * scale))))
    new_h = min(digit_size, max(1, int(round(h * scale))))
    resized = cv2.resize(gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)

    canvas = np.full((digit_size, digit_size), 255, dtype=np.uint8)
    rh, rw = resized.shape[:2]
    x_offset = max(0, (digit_size - rw) // 2)
    y_offset = max(0, (digit_size - rh) // 2)
    canvas[y_offset:y_offset + rh, x_offset:x_offset + rw] = resized
    return canvas


def split_integer_cells(integer_crop: np.ndarray, integer_slots: int) -> list[np.ndarray]:
    cells: list[np.ndarray] = []
    width = integer_crop.shape[1]
    for index in range(integer_slots):
        x1 = int(round(index * width / integer_slots))
        x2 = int(round((index + 1) * width / integer_slots))
        x2 = max(x2, x1 + 1)
        cells.append(integer_crop[:, x1:x2])
    return cells


def build_dataset(config: BuildConfig) -> None:
    config.output_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = config.output_dir / "metadata.csv"
    skipped_path = config.output_dir / "skipped.csv"
    summary_path = config.output_dir / "summary.json"

    rows = list(csv.DictReader(config.data_csv.open("r", encoding="utf-8-sig")))
    metadata_rows: list[dict[str, str]] = []
    skipped_rows: list[dict[str, str]] = []
    summary: dict[str, int] = {
        "source_images": 0,
        "digit_images": 0,
        "skipped_images": 0,
        "red_mask_cuts": 0,
        "ratio_fallback_cuts": 0,
    }

    for row in rows:
        photo_name = row.get("photo_name", "")
        image_path = config.images_dir / photo_name
        summary["source_images"] += 1

        if not image_path.exists():
            skipped_rows.append({"photo_name": photo_name, "reason": "missing_image"})
            summary["skipped_images"] += 1
            continue

        image = imread_unicode(image_path)
        if image is None:
            skipped_rows.append({"photo_name": photo_name, "reason": "opencv_read_failed"})
            summary["skipped_images"] += 1
            continue

        bounds = parse_polygon_bounds(row.get("location", ""), image.shape[1], image.shape[0])
        padded_integer = expected_integer_string(row.get("value", ""), config.integer_slots)

        if bounds is None:
            skipped_rows.append({"photo_name": photo_name, "reason": "missing_polygon"})
            summary["skipped_images"] += 1
            continue
        if padded_integer is None:
            skipped_rows.append({"photo_name": photo_name, "reason": "bad_integer_value"})
            summary["skipped_images"] += 1
            continue

        min_x, min_y, max_x, max_y = bounds
        pad_x = max(4, int((max_x - min_x) * config.pad_x_ratio))
        pad_y = max(4, int((max_y - min_y) * config.pad_y_ratio))

        x1 = max(0, min_x - pad_x)
        y1 = max(0, min_y - pad_y)
        x2 = min(image.shape[1], max_x + pad_x)
        y2 = min(image.shape[0], max_y + pad_y)

        reading_crop = image[y1:y2, x1:x2]
        if reading_crop.size == 0 or reading_crop.shape[1] < config.integer_slots:
            skipped_rows.append({"photo_name": photo_name, "reason": "invalid_reading_crop"})
            summary["skipped_images"] += 1
            continue

        decimal_start, cut_source = detect_decimal_start(
            reading_crop,
            integer_slots=config.integer_slots,
            total_slots=config.total_slots,
        )
        summary[f"{cut_source}_cuts"] += 1

        integer_crop = reading_crop[:, :decimal_start]
        if integer_crop.size == 0 or integer_crop.shape[1] < config.integer_slots:
            skipped_rows.append({"photo_name": photo_name, "reason": "invalid_integer_crop"})
            summary["skipped_images"] += 1
            continue

        split_name = deterministic_split(photo_name)
        cells = split_integer_cells(integer_crop, config.integer_slots)

        for slot_index, (digit_label, cell) in enumerate(zip(padded_integer, cells)):
            digit_img = normalize_digit_cell(cell, config.digit_size)
            digit_dir = config.output_dir / split_name / digit_label
            digit_dir.mkdir(parents=True, exist_ok=True)

            out_name = f"{Path(photo_name).stem}_slot{slot_index}_{digit_label}.png"
            out_path = digit_dir / out_name
            cv2.imwrite(str(out_path), digit_img)

            metadata_rows.append(
                {
                    "photo_name": photo_name,
                    "split": split_name,
                    "digit_label": digit_label,
                    "slot_index": str(slot_index),
                    "expected_integer": padded_integer,
                    "cut_source": cut_source,
                    "output_path": str(out_path),
                }
            )
            summary["digit_images"] += 1

    with metadata_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "photo_name",
                "split",
                "digit_label",
                "slot_index",
                "expected_integer",
                "cut_source",
                "output_path",
            ],
        )
        writer.writeheader()
        writer.writerows(metadata_rows)

    with skipped_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["photo_name", "reason"])
        writer.writeheader()
        writer.writerows(skipped_rows)

    summary["usable_images"] = summary["source_images"] - summary["skipped_images"]
    summary["config"] = {
        "integer_slots": config.integer_slots,
        "total_slots": config.total_slots,
        "digit_size": config.digit_size,
    }
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    print(json.dumps(summary, indent=2))
    print(f"metadata -> {metadata_path}")
    print(f"skipped  -> {skipped_path}")


def main() -> None:
    args = parse_args()
    config = BuildConfig(
        images_dir=args.images_dir,
        data_csv=args.data_csv,
        output_dir=args.output_dir,
        integer_slots=args.integer_slots,
        total_slots=args.total_slots,
        digit_size=args.digit_size,
    )
    build_dataset(config)


if __name__ == "__main__":
    main()
