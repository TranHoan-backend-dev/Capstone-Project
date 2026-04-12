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
import torch


READING_LABEL = "Current_pointer_reading_region"
DECIMAL_LABEL = "Current_pointer_decimal_region"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


@dataclass(frozen=True)
class EvalConfig:
    model_path: Path
    output_csv: Path
    integer_slots: int = 5
    total_slots: int = 8
    image_size: int = 32
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

    def list_image_entries(self, split_filter: set[str]) -> list[tuple[str, str]]:
        image_entries: list[tuple[str, str]] = []

        if self.archive is not None:
            names = [entry.filename for entry in self.archive.infolist() if not entry.is_dir()]
        else:
            names = []
            for split in split_filter:
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
            if split not in split_filter:
                continue
            if folder != "images":
                continue
            if Path(file_name).suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            image_entries.append((split, normalized))

        image_entries.sort()
        return image_entries


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluate a digit classifier directly on a YOLO dataset root or zip."
    )
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--yolo-root", type=Path, help="Extracted YOLO dataset folder containing train/valid/test.")
    source.add_argument("--yolo-zip", type=Path, help="YOLO dataset zip file exported from Roboflow.")
    parser.add_argument(
        "--model-path",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\models\reading_digit_classifier_v6.pt"),
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\digit_classifier_eval_v6.csv"),
    )
    parser.add_argument("--splits", nargs="+", default=["test"], help="Which YOLO splits to evaluate: train valid test")
    parser.add_argument("--integer-slots", type=int, default=5)
    parser.add_argument("--total-slots", type=int, default=8)
    parser.add_argument("--image-size", type=int, default=32)
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


def strip_leading_zeros(text: str) -> str:
    normalized = text.lstrip("0")
    return normalized or "0"


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
        candidates.append((overlap_ratio, detection))

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


class DigitClassifier(torch.nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.features = torch.nn.Sequential(
            torch.nn.Conv2d(1, 32, kernel_size=3, padding=1),
            torch.nn.ReLU(inplace=True),
            torch.nn.MaxPool2d(2),
            torch.nn.Conv2d(32, 64, kernel_size=3, padding=1),
            torch.nn.ReLU(inplace=True),
            torch.nn.MaxPool2d(2),
            torch.nn.Conv2d(64, 128, kernel_size=3, padding=1),
            torch.nn.ReLU(inplace=True),
            torch.nn.AdaptiveAvgPool2d((1, 1)),
        )
        self.classifier = torch.nn.Sequential(
            torch.nn.Flatten(),
            torch.nn.Linear(128, 64),
            torch.nn.ReLU(inplace=True),
            torch.nn.Dropout(0.2),
            torch.nn.Linear(64, 10),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(self.features(x))


class DigitRecognizer:
    def __init__(self, model_path: Path, image_size: int) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = DigitClassifier().to(self.device)
        checkpoint = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.eval()
        self.image_size = int(checkpoint.get("image_size", image_size))

    def predict_digit(self, digit_img: np.ndarray) -> tuple[str, float]:
        digit_img = cv2.resize(digit_img, (self.image_size, self.image_size), interpolation=cv2.INTER_CUBIC)
        image = digit_img.astype(np.float32) / 255.0
        image = (image - 0.5) / 0.5
        tensor = torch.from_numpy(image).unsqueeze(0).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)
            probabilities = torch.softmax(logits, dim=1)[0]

        index = int(probabilities.argmax().item())
        confidence = float(probabilities[index].item())
        return str(index), confidence


def evaluate(source: YoloSource, config: EvalConfig, split_filter: set[str]) -> None:
    data_yaml = source.read_text("data.yaml")
    class_names = parse_names_from_data_yaml(data_yaml)
    reading_class_id = class_names.index(READING_LABEL)
    decimal_class_id = class_names.index(DECIMAL_LABEL)

    recognizer = DigitRecognizer(config.model_path, config.image_size)
    config.output_csv.parent.mkdir(parents=True, exist_ok=True)

    summary = {
        "source_images": 0,
        "usable_images": 0,
        "exact_match": 0,
        "normalized_match": 0,
        "skipped_images": 0,
        "decimal_label_cuts": 0,
        "ratio_fallback_cuts": 0,
        "splits": sorted(split_filter),
    }
    result_rows: list[dict[str, str]] = []

    for split_name, image_rel_path in source.list_image_entries(split_filter):
        summary["source_images"] += 1
        image_name = Path(image_rel_path).name
        expected_integer = parse_expected_integer_from_name(image_name, config.integer_slots)
        if expected_integer is None:
            summary["skipped_images"] += 1
            result_rows.append(
                {
                    "split": split_name,
                    "image": image_rel_path,
                    "expected_integer": "",
                    "predicted_integer": "",
                    "expected_normalized": "",
                    "predicted_normalized": "",
                    "exact_match": "0",
                    "normalized_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "missing_value_in_filename",
                }
            )
            continue

        label_rel_path = image_rel_path.replace("/images/", "/labels/")
        label_rel_path = f"{os.path.splitext(label_rel_path)[0]}.txt"
        if not source.exists(label_rel_path):
            summary["skipped_images"] += 1
            result_rows.append(
                {
                    "split": split_name,
                    "image": image_rel_path,
                    "expected_integer": expected_integer,
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected_integer),
                    "predicted_normalized": "",
                    "exact_match": "0",
                    "normalized_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "missing_label_file",
                }
            )
            continue

        image = source.read_image(image_rel_path)
        if image is None:
            summary["skipped_images"] += 1
            result_rows.append(
                {
                    "split": split_name,
                    "image": image_rel_path,
                    "expected_integer": expected_integer,
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected_integer),
                    "predicted_normalized": "",
                    "exact_match": "0",
                    "normalized_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "image_read_failed",
                }
            )
            continue

        detections = parse_label_text(source.read_text(label_rel_path), image.shape[1], image.shape[0])
        reading_detections = [item for item in detections if item["class_id"] == reading_class_id]
        decimal_detections = [item for item in detections if item["class_id"] == decimal_class_id]

        if not reading_detections:
            summary["skipped_images"] += 1
            result_rows.append(
                {
                    "split": split_name,
                    "image": image_rel_path,
                    "expected_integer": expected_integer,
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected_integer),
                    "predicted_normalized": "",
                    "exact_match": "0",
                    "normalized_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "missing_reading_label",
                }
            )
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
            summary["skipped_images"] += 1
            result_rows.append(
                {
                    "split": split_name,
                    "image": image_rel_path,
                    "expected_integer": expected_integer,
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected_integer),
                    "predicted_normalized": "",
                    "exact_match": "0",
                    "normalized_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": cut_source,
                    "reason": "invalid_integer_crop",
                }
            )
            continue

        summary["usable_images"] += 1
        summary[f"{cut_source}_cuts"] += 1

        predicted_digits: list[str] = []
        digit_confidences: list[float] = []
        for cell in split_integer_cells(reading_crop, config.integer_slots):
            digit_img = normalize_digit_cell(cell, config.image_size)
            digit_text, digit_conf = recognizer.predict_digit(digit_img)
            predicted_digits.append(digit_text)
            digit_confidences.append(digit_conf)

        predicted_integer = "".join(predicted_digits)
        expected_normalized = strip_leading_zeros(expected_integer)
        predicted_normalized = strip_leading_zeros(predicted_integer)
        exact_match = int(predicted_integer == expected_integer)
        normalized_match = int(predicted_normalized == expected_normalized)

        summary["exact_match"] += exact_match
        summary["normalized_match"] += normalized_match

        result_rows.append(
            {
                "split": split_name,
                "image": image_rel_path,
                "expected_integer": expected_integer,
                "predicted_integer": predicted_integer,
                "expected_normalized": expected_normalized,
                "predicted_normalized": predicted_normalized,
                "exact_match": str(exact_match),
                "normalized_match": str(normalized_match),
                "avg_digit_conf": f"{(sum(digit_confidences) / max(len(digit_confidences), 1)):.4f}",
                "cut_source": cut_source,
                "reason": "",
            }
        )

    with config.output_csv.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "split",
                "image",
                "expected_integer",
                "predicted_integer",
                "expected_normalized",
                "predicted_normalized",
                "exact_match",
                "normalized_match",
                "avg_digit_conf",
                "cut_source",
                "reason",
            ],
        )
        writer.writeheader()
        writer.writerows(result_rows)

    summary["exact_match_rate"] = summary["exact_match"] / max(summary["usable_images"], 1)
    summary["normalized_match_rate"] = summary["normalized_match"] / max(summary["usable_images"], 1)
    summary_path = config.output_csv.with_suffix(".json")
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    print(json.dumps(summary, indent=2))
    print(f"report  -> {config.output_csv}")
    print(f"summary -> {summary_path}")


def main() -> None:
    args = parse_args()
    source = YoloSource(root_dir=args.yolo_root, zip_path=args.yolo_zip)
    try:
        config = EvalConfig(
            model_path=args.model_path,
            output_csv=args.output_csv,
            integer_slots=args.integer_slots,
            total_slots=args.total_slots,
            image_size=args.image_size,
        )
        evaluate(source, config, {split.lower() for split in args.splits})
    finally:
        source.close()


if __name__ == "__main__":
    main()
