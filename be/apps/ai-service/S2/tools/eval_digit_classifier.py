from __future__ import annotations

import argparse
import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
import torch


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluate a trained digit classifier on full meter images using data.csv polygons."
    )
    parser.add_argument("--images-dir", type=Path, required=True, help="Folder containing source meter images.")
    parser.add_argument("--data-csv", type=Path, required=True, help="CSV file containing photo_name, value, and polygon location.")
    parser.add_argument(
        "--model-path",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\models\reading_digit_classifier.pt"),
        help="Path to the trained digit-classifier checkpoint.",
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        default=Path(r"D:\yolo_paddle_realtime\digit_classifier_eval.csv"),
        help="Where to save per-image evaluation results.",
    )
    parser.add_argument("--integer-slots", type=int, default=5, help="Visible black-digit slots before the decimal part.")
    parser.add_argument("--total-slots", type=int, default=8, help="Total reading slots, used for ratio fallback when red detection fails.")
    parser.add_argument("--image-size", type=int, default=32, help="Classifier input image size.")
    return parser.parse_args()


@dataclass(frozen=True)
class EvalConfig:
    images_dir: Path
    data_csv: Path
    model_path: Path
    output_csv: Path
    integer_slots: int = 5
    total_slots: int = 8
    image_size: int = 32
    pad_x_ratio: float = 0.06
    pad_y_ratio: float = 0.20


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


def strip_leading_zeros(text: str) -> str:
    normalized = text.lstrip("0")
    return normalized or "0"


def imread_unicode(path: Path) -> np.ndarray | None:
    try:
        buffer = np.fromfile(str(path), dtype=np.uint8)
    except OSError:
        return None

    if buffer.size == 0:
        return None

    return cv2.imdecode(buffer, cv2.IMREAD_COLOR)


def detect_decimal_start(crop: np.ndarray, integer_slots: int, total_slots: int) -> tuple[int, str]:
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


def evaluate(config: EvalConfig) -> None:
    recognizer = DigitRecognizer(config.model_path, config.image_size)
    rows = list(csv.DictReader(config.data_csv.open("r", encoding="utf-8-sig")))

    config.output_csv.parent.mkdir(parents=True, exist_ok=True)
    result_rows: list[dict[str, str]] = []
    summary = {
        "source_images": 0,
        "usable_images": 0,
        "missing_images": 0,
        "missing_polygons": 0,
        "bad_integer_values": 0,
        "invalid_crops": 0,
        "exact_match": 0,
        "normalized_match": 0,
        "red_mask_cuts": 0,
        "ratio_fallback_cuts": 0,
    }

    for row in rows:
        summary["source_images"] += 1
        photo_name = row.get("photo_name", "")
        image_path = config.images_dir / photo_name
        expected = expected_integer_string(row.get("value", ""), config.integer_slots)

        if not image_path.exists():
            summary["missing_images"] += 1
            result_rows.append(
                {
                    "photo_name": photo_name,
                    "expected_integer": expected or "",
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected or "0") if expected else "",
                    "predicted_normalized": "",
                    "normalized_match": "0",
                    "exact_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "missing_image",
                }
            )
            continue

        image = imread_unicode(image_path)
        if image is None:
            summary["missing_images"] += 1
            result_rows.append(
                {
                    "photo_name": photo_name,
                    "expected_integer": expected or "",
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected or "0") if expected else "",
                    "predicted_normalized": "",
                    "normalized_match": "0",
                    "exact_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "opencv_read_failed",
                }
            )
            continue

        bounds = parse_polygon_bounds(row.get("location", ""), image.shape[1], image.shape[0])
        if bounds is None:
            summary["missing_polygons"] += 1
            result_rows.append(
                {
                    "photo_name": photo_name,
                    "expected_integer": expected or "",
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected or "0") if expected else "",
                    "predicted_normalized": "",
                    "normalized_match": "0",
                    "exact_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "missing_polygon",
                }
            )
            continue

        if expected is None:
            summary["bad_integer_values"] += 1
            result_rows.append(
                {
                    "photo_name": photo_name,
                    "expected_integer": "",
                    "predicted_integer": "",
                    "expected_normalized": "",
                    "predicted_normalized": "",
                    "normalized_match": "0",
                    "exact_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "bad_integer_value",
                }
            )
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
            summary["invalid_crops"] += 1
            result_rows.append(
                {
                    "photo_name": photo_name,
                    "expected_integer": expected,
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected),
                    "predicted_normalized": "",
                    "normalized_match": "0",
                    "exact_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": "",
                    "reason": "invalid_reading_crop",
                }
            )
            continue

        decimal_start, cut_source = detect_decimal_start(
            reading_crop,
            integer_slots=config.integer_slots,
            total_slots=config.total_slots,
        )
        summary[f"{cut_source}_cuts"] += 1

        integer_crop = reading_crop[:, :decimal_start]
        if integer_crop.size == 0 or integer_crop.shape[1] < config.integer_slots:
            summary["invalid_crops"] += 1
            result_rows.append(
                {
                    "photo_name": photo_name,
                    "expected_integer": expected,
                    "predicted_integer": "",
                    "expected_normalized": strip_leading_zeros(expected),
                    "predicted_normalized": "",
                    "normalized_match": "0",
                    "exact_match": "0",
                    "avg_digit_conf": "",
                    "cut_source": cut_source,
                    "reason": "invalid_integer_crop",
                }
            )
            continue

        predicted_digits: list[str] = []
        digit_confidences: list[float] = []
        for cell in split_integer_cells(integer_crop, config.integer_slots):
            digit_img = normalize_digit_cell(cell, config.image_size)
            digit_text, digit_conf = recognizer.predict_digit(digit_img)
            predicted_digits.append(digit_text)
            digit_confidences.append(digit_conf)

        predicted_integer = "".join(predicted_digits)
        expected_normalized = strip_leading_zeros(expected)
        predicted_normalized = strip_leading_zeros(predicted_integer)
        exact_match = int(predicted_integer == expected)
        normalized_match = int(predicted_normalized == expected_normalized)

        summary["usable_images"] += 1
        summary["exact_match"] += exact_match
        summary["normalized_match"] += normalized_match

        result_rows.append(
            {
                "photo_name": photo_name,
                "expected_integer": expected,
                "predicted_integer": predicted_integer,
                "expected_normalized": expected_normalized,
                "predicted_normalized": predicted_normalized,
                "normalized_match": str(normalized_match),
                "exact_match": str(exact_match),
                "avg_digit_conf": f"{(sum(digit_confidences) / max(len(digit_confidences), 1)):.4f}",
                "cut_source": cut_source,
                "reason": "",
            }
        )

    with config.output_csv.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "photo_name",
                "expected_integer",
                "predicted_integer",
                "expected_normalized",
                "predicted_normalized",
                "normalized_match",
                "exact_match",
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
    config = EvalConfig(
        images_dir=args.images_dir,
        data_csv=args.data_csv,
        model_path=args.model_path,
        output_csv=args.output_csv,
        integer_slots=args.integer_slots,
        total_slots=args.total_slots,
        image_size=args.image_size,
    )
    evaluate(config)


if __name__ == "__main__":
    main()
