from __future__ import annotations

import argparse
import ast
import csv
import json
import os
import re
import zipfile
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np


READING_LABEL = "Current_pointer_reading_region"
DECIMAL_LABEL = "Current_pointer_decimal_region"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


@dataclass(frozen=True)
class BuildConfig:
    output_dir: Path
    integer_slots: int = 5
    total_slots: int = 8
    digit_size: int = 32
    pad_x_ratio: float = 0.04
    pad_y_ratio: float = 0.15


class YoloSource:
    def __init__(self, root_dir: Path | None = None, zip_path: Path | None = None):
        self.root_dir = root_dir
        self.zip_path = zip_path
        self.archive: zipfile.ZipFile | None = None

        if (root_dir is None) == (zip_path is None):
            raise ValueError("Provide exactly one of root_dir or zip_path.")

        if zip_path is not None:
            self.archive = zipfile.ZipFile(zip_path, "r")

    def close(self) -> None:
        if self.archive is not None:
            self.archive.close()

    def _normalize(self, path: str) -> str:
        return path.replace("\\", "/")

    def read_text(self, rel_path: str) -> str:
        rel_path = self._normalize(rel_path)
        if self.archive is not None:
            with self.archive.open(rel_path, "r") as f:
                return f.read().decode("utf-8")

        return (self.root_dir / rel_path).read_text(encoding="utf-8")

    def exists(self, rel_path: str) -> bool:
        rel_path = self._normalize(rel_path)
        if self.archive is not None:
            try:
                self.archive.getinfo(rel_path)
                return True
            except KeyError:
                return False

        return (self.root_dir / rel_path).exists()

    def read_image(self, rel_path: str) -> np.ndarray | None:
        rel_path = self._normalize(rel_path)
        if self.archive is not None:
            try:
                with self.archive.open(rel_path, "r") as f:
                    data = np.frombuffer(f.read(), dtype=np.uint8)
            except KeyError:
                return None
            return cv2.imdecode(data, cv2.IMREAD_COLOR)

        image_path = self.root_dir / rel_path
        try:
            data = np.fromfile(str(image_path), dtype=np.uint8)
        except OSError:
            return None

        if data.size == 0:
            return None

        return cv2.imdecode(data, cv2.IMREAD_COLOR)

    def list_image_entries(self) -> list[tuple[str, str]]:
        image_entries: list[tuple[str, str]] = []

        if self.archive is not None:
            names = [entry.filename for entry in self.archive.infolist() if not entry.is_dir()]
        else:
            names = []
            for split in ("train", "valid", "test"):
                base = self.root_dir / split / "images"
                if not base.exists():
                    continue
                for path in base.rglob("*"):
                    if path.is_file():
                        rel_path = path.relative_to(self.root_dir).as_posix()
                        names.append(rel_path)

        for rel_path in names:
            normalized = self._normalize(rel_path)
            parts = normalized.split("/")
            if len(parts) < 3:
                continue
            split, folder, file_name = parts[0], parts[1], parts[-1]
            if folder != "images":
                continue
            if Path(file_name).suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            image_entries.append((split, normalized))

        image_entries.sort()
        return image_entries


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build a digit-classification dataset directly from a YOLO dataset root or zip."
    )
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--yolo-root", type=Path, help="Extracted YOLO dataset folder containing train/valid/test.")
    source.add_argument("--yolo-zip", type=Path, help="YOLO dataset zip file exported from Roboflow.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\digit_dataset_v6"),
        help="Destination folder for the generated digit dataset.",
    )
    parser.add_argument("--integer-slots", type=int, default=5)
    parser.add_argument("--total-slots", type=int, default=8)
    parser.add_argument("--digit-size", type=int, default=32)
    return parser.parse_args()


def parse_names_from_data_yaml(text: str) -> list[str]:
    match = re.search(r"names:\s*(\[[^\n]+\])", text)
    if not match:
        raise RuntimeError("Could not parse 'names' from data.yaml")
    names = ast.literal_eval(match.group(1))
    if not isinstance(names, list):
        raise RuntimeError("'names' in data.yaml is not a list")
    return [str(name) for name in names]


def parse_expected_integer_from_name(file_name: str, integer_slots: int) -> str | None:
    match = re.search(r"value_(\d+)_\d+", file_name)
    if not match:
        return None

    digits = re.sub(r"[^0-9]", "", match.group(1))
    if not digits or len(digits) > integer_slots:
        return None

    return digits.zfill(integer_slots)


def polygon_to_box(coords: list[float], width: int, height: int) -> tuple[int, int, int, int] | None:
    if len(coords) < 6 or len(coords) % 2 != 0:
        return None

    xs = [coords[i] * width for i in range(0, len(coords), 2)]
    ys = [coords[i] * height for i in range(1, len(coords), 2)]
    x1 = int(np.floor(min(xs)))
    y1 = int(np.floor(min(ys)))
    x2 = int(np.ceil(max(xs)))
    y2 = int(np.ceil(max(ys)))

    if x2 <= x1 or y2 <= y1:
        return None

    return x1, y1, x2, y2


def parse_label_text(label_text: str, width: int, height: int) -> list[dict[str, object]]:
    detections: list[dict[str, object]] = []
    for raw_line in label_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        parts = line.split()
        if len(parts) < 7:
            continue

        try:
            class_id = int(float(parts[0]))
            coords = [float(value) for value in parts[1:]]
        except ValueError:
            continue

        box = polygon_to_box(coords, width, height)
        if box is None:
            continue

        detections.append({"class_id": class_id, "box": box})

    return detections


def _boxes_overlap(box1, box2) -> bool:
    x1a, y1a, x2a, y2a = box1
    x1b, y1b, x2b, y2b = box2
    return not (x2a < x1b or x2b < x1a or y2a < y1b or y2b < y1a)


def _intersection_area(box1, box2) -> int:
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    if x2 <= x1 or y2 <= y1:
        return 0
    return (x2 - x1) * (y2 - y1)


def _select_decimal_detection_for_reading(reading_box, decimal_detections):
    rx1, _, rx2, _ = reading_box
    reading_width = max(1, rx2 - rx1)
    reading_center_x = rx1 + (reading_width / 2)

    candidates = []
    for detection in decimal_detections:
        decimal_box = detection["box"]
        if not _boxes_overlap(reading_box, decimal_box):
            continue

        intersection = _intersection_area(reading_box, decimal_box)
        if intersection <= 0:
            continue

        dx1, _, dx2, _ = decimal_box
        decimal_center_x = dx1 + ((dx2 - dx1) / 2)
        if decimal_center_x <= reading_center_x and dx1 <= rx1 + int(reading_width * 0.35):
            continue

        overlap_ratio = intersection / max(1, (dx2 - dx1) * (decimal_box[3] - decimal_box[1]))
        score = overlap_ratio
        candidates.append((score, detection))

    if not candidates:
        return None

    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates[0][1]


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


def build_dataset(source: YoloSource, config: BuildConfig) -> None:
    data_yaml = source.read_text("data.yaml")
    class_names = parse_names_from_data_yaml(data_yaml)
    reading_class_id = class_names.index(READING_LABEL)
    decimal_class_id = class_names.index(DECIMAL_LABEL)

    config.output_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = config.output_dir / "metadata.csv"
    skipped_path = config.output_dir / "skipped.csv"
    summary_path = config.output_dir / "summary.json"

    summary: dict[str, int] = {
        "source_images": 0,
        "usable_images": 0,
        "digit_images": 0,
        "skipped_images": 0,
        "decimal_label_cuts": 0,
        "ratio_fallback_cuts": 0,
    }
    metadata_rows: list[dict[str, str]] = []
    skipped_rows: list[dict[str, str]] = []

    for split_name, image_rel_path in source.list_image_entries():
        summary["source_images"] += 1
        image_name = Path(image_rel_path).name
        expected_integer = parse_expected_integer_from_name(image_name, config.integer_slots)
        if expected_integer is None:
            skipped_rows.append({"image": image_rel_path, "reason": "missing_value_in_filename"})
            summary["skipped_images"] += 1
            continue

        label_rel_path = image_rel_path.replace("/images/", "/labels/")
        label_rel_path = f"{os.path.splitext(label_rel_path)[0]}.txt"
        if not source.exists(label_rel_path):
            skipped_rows.append({"image": image_rel_path, "reason": "missing_label_file"})
            summary["skipped_images"] += 1
            continue

        image = source.read_image(image_rel_path)
        if image is None:
            skipped_rows.append({"image": image_rel_path, "reason": "image_read_failed"})
            summary["skipped_images"] += 1
            continue

        detections = parse_label_text(source.read_text(label_rel_path), image.shape[1], image.shape[0])
        reading_detections = [item for item in detections if item["class_id"] == reading_class_id]
        decimal_detections = [item for item in detections if item["class_id"] == decimal_class_id]

        if not reading_detections:
            skipped_rows.append({"image": image_rel_path, "reason": "missing_reading_label"})
            summary["skipped_images"] += 1
            continue

        reading_detection = max(
            reading_detections,
            key=lambda item: (item["box"][2] - item["box"][0]) * (item["box"][3] - item["box"][1]),
        )
        decimal_detection = _select_decimal_detection_for_reading(reading_detection["box"], decimal_detections)

        min_x, min_y, max_x, max_y = reading_detection["box"]
        pad_x = max(2, int((max_x - min_x) * config.pad_x_ratio))
        pad_y = max(2, int((max_y - min_y) * config.pad_y_ratio))

        x1 = max(0, min_x - pad_x)
        y1 = max(0, min_y - pad_y)
        x2 = min(image.shape[1], max_x + pad_x)
        y2 = min(image.shape[0], max_y + pad_y)

        if decimal_detection is not None:
            decimal_x1 = decimal_detection["box"][0]
            x2 = min(x2, max(x1 + 1, decimal_x1 - max(1, pad_x)))
            cut_source = "decimal_label"
        else:
            ratio_cut = int(round((max_x - min_x) * (config.integer_slots / max(config.total_slots, 1))))
            x2 = min(x2, max(x1 + 1, min_x + ratio_cut))
            cut_source = "ratio_fallback"

        reading_crop = image[y1:y2, x1:x2]
        if reading_crop.size == 0 or reading_crop.shape[1] < config.integer_slots:
            skipped_rows.append({"image": image_rel_path, "reason": "invalid_integer_crop"})
            summary["skipped_images"] += 1
            continue

        summary[f"{cut_source}_cuts"] += 1
        summary["usable_images"] += 1

        out_split = "val" if split_name == "valid" else split_name
        for slot_index, (digit_label, cell) in enumerate(zip(expected_integer, split_integer_cells(reading_crop, config.integer_slots))):
            digit_img = normalize_digit_cell(cell, config.digit_size)
            digit_dir = config.output_dir / out_split / digit_label
            digit_dir.mkdir(parents=True, exist_ok=True)

            out_name = f"{Path(image_name).stem}_slot{slot_index}_{digit_label}.png"
            out_path = digit_dir / out_name
            cv2.imwrite(str(out_path), digit_img)

            metadata_rows.append(
                {
                    "image": image_rel_path,
                    "split": out_split,
                    "digit_label": digit_label,
                    "slot_index": str(slot_index),
                    "expected_integer": expected_integer,
                    "cut_source": cut_source,
                    "output_path": str(out_path),
                }
            )
            summary["digit_images"] += 1

    with metadata_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "image",
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
        writer = csv.DictWriter(f, fieldnames=["image", "reason"])
        writer.writeheader()
        writer.writerows(skipped_rows)

    summary["config"] = {
        "integer_slots": config.integer_slots,
        "total_slots": config.total_slots,
        "digit_size": config.digit_size,
        "source": "yolo_zip" if source.zip_path is not None else "yolo_root",
    }
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    print(json.dumps(summary, indent=2))
    print(f"metadata -> {metadata_path}")
    print(f"skipped  -> {skipped_path}")


def main() -> None:
    args = parse_args()
    source = YoloSource(root_dir=args.yolo_root, zip_path=args.yolo_zip)
    try:
        config = BuildConfig(
            output_dir=args.output_dir,
            integer_slots=args.integer_slots,
            total_slots=args.total_slots,
            digit_size=args.digit_size,
        )
        build_dataset(source, config)
    finally:
        source.close()


if __name__ == "__main__":
    main()
