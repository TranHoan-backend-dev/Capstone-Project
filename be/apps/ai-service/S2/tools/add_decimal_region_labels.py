from __future__ import annotations

import argparse
import math
import shutil
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
import yaml


IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")
READING_LABEL = "Current_pointer_reading_region"
DECIMAL_LABEL = "Current_pointer_decimal_region"


@dataclass
class Annotation:
    class_id: int
    points: list[tuple[float, float]]


def _load_yaml(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def _save_yaml(path: Path, payload: dict) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        yaml.safe_dump(payload, handle, sort_keys=False, allow_unicode=True)


def _find_image(images_dir: Path, stem: str) -> Path | None:
    for extension in IMAGE_EXTENSIONS:
        candidate = images_dir / f"{stem}{extension}"
        if candidate.exists():
            return candidate
    matches = list(images_dir.glob(f"{stem}.*"))
    return matches[0] if matches else None


def _parse_annotation_line(raw_line: str) -> Annotation | None:
    parts = raw_line.strip().split()
    if len(parts) < 9 or len(parts[1:]) % 2 != 0:
        return None

    class_id = int(float(parts[0]))
    coords = [float(value) for value in parts[1:]]
    points = [(coords[index], coords[index + 1]) for index in range(0, len(coords), 2)]
    return Annotation(class_id=class_id, points=points)


def _format_annotation_line(class_id: int, points: list[tuple[float, float]]) -> str:
    payload = [str(class_id)]
    for x, y in points:
        payload.append(f"{x:.6f}")
        payload.append(f"{y:.6f}")
    return " ".join(payload)


def _normalized_to_pixels(points: list[tuple[float, float]], width: int, height: int) -> np.ndarray:
    pixel_points = []
    for x, y in points:
        px = int(round(x * width))
        py = int(round(y * height))
        px = max(0, min(width - 1, px))
        py = max(0, min(height - 1, py))
        pixel_points.append((px, py))
    return np.array(pixel_points, dtype=np.int32)


def _build_red_mask(image: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    lower_red_1 = np.array([0, 35, 35], dtype=np.uint8)
    upper_red_1 = np.array([20, 255, 255], dtype=np.uint8)
    lower_red_2 = np.array([160, 35, 35], dtype=np.uint8)
    upper_red_2 = np.array([180, 255, 255], dtype=np.uint8)

    hsv_mask = cv2.bitwise_or(
        cv2.inRange(hsv, lower_red_1, upper_red_1),
        cv2.inRange(hsv, lower_red_2, upper_red_2),
    )

    b_channel, g_channel, r_channel = cv2.split(image)
    r_channel = r_channel.astype(np.int16)
    g_channel = g_channel.astype(np.int16)
    b_channel = b_channel.astype(np.int16)

    channel_mask = (
        (r_channel > 65)
        & (r_channel - g_channel > 15)
        & (r_channel - b_channel > 15)
    ).astype(np.uint8) * 255

    red_mask = cv2.bitwise_or(hsv_mask, channel_mask)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    red_mask = cv2.dilate(red_mask, kernel, iterations=1)
    return red_mask


def _contiguous_groups(indices: list[int]) -> list[tuple[int, int]]:
    if not indices:
        return []

    groups: list[tuple[int, int]] = []
    start = indices[0]
    end = indices[0]
    for value in indices[1:]:
        if value == end + 1:
            end = value
            continue
        groups.append((start, end))
        start = value
        end = value
    groups.append((start, end))
    return groups


def _decimal_polygon_from_reading(image: np.ndarray, polygon: np.ndarray) -> list[tuple[float, float]] | None:
    x, y, width, height = cv2.boundingRect(polygon)
    if width <= 0 or height <= 0:
        return None

    crop = image[y : y + height, x : x + width]
    if crop.size == 0:
        return None

    polygon_mask = np.zeros((height, width), dtype=np.uint8)
    shifted_polygon = polygon - np.array([[x, y]], dtype=np.int32)
    cv2.fillPoly(polygon_mask, [shifted_polygon], 255)

    red_mask = _build_red_mask(crop)
    red_mask = cv2.bitwise_and(red_mask, polygon_mask)

    polygon_height = max(1, height)
    search_start = int(width * 0.45)
    column_strength = red_mask.sum(axis=0) / (255 * polygon_height)
    red_columns = [
        index
        for index, value in enumerate(column_strength)
        if index >= search_start and value >= 0.02
    ]
    if not red_columns:
        return None

    groups = _contiguous_groups(red_columns)
    if not groups:
        return None

    def score_group(group: tuple[int, int]) -> float:
        start, end = group
        span = end - start + 1
        strength = float(np.sum(column_strength[start : end + 1]))
        right_bias = end / max(1, width - 1)
        return strength + span * 0.25 + right_bias * 4.0

    group_start, group_end = max(groups, key=score_group)

    left_margin = max(2, int(round(width * 0.01)))
    right_margin = max(2, int(round(width * 0.015)))
    decimal_left = max(group_start - left_margin, 0)
    decimal_right = min(group_end + right_margin, width - 1)

    # If the detected decimal block starts too early, treat it as unreliable.
    if decimal_left < int(width * 0.35):
        return None

    full_right = width - 1
    top = 0
    bottom = height - 1

    image_height, image_width = image.shape[:2]
    rectangle = [
        (x + decimal_left, y + top),
        (x + full_right, y + top),
        (x + full_right, y + bottom),
        (x + decimal_left, y + bottom),
    ]

    normalized = [
        (
            max(0.0, min(1.0, px / image_width)),
            max(0.0, min(1.0, py / image_height)),
        )
        for px, py in rectangle
    ]
    return normalized


def _process_split(split_dir: Path, reading_class_id: int, decimal_class_id: int) -> tuple[int, int]:
    labels_dir = split_dir / "labels"
    images_dir = split_dir / "images"
    if not labels_dir.exists() or not images_dir.exists():
        return 0, 0

    updated_files = 0
    added_regions = 0

    for label_path in sorted(labels_dir.glob("*.txt")):
        image_path = _find_image(images_dir, label_path.stem)
        if image_path is None:
            continue

        image = cv2.imread(str(image_path))
        if image is None:
            continue

        raw_lines = label_path.read_text(encoding="utf-8").splitlines()
        annotations = []
        for raw_line in raw_lines:
            annotation = _parse_annotation_line(raw_line)
            if annotation is not None:
                annotations.append(annotation)

        decimal_lines: list[str] = []
        for annotation in annotations:
            if annotation.class_id != reading_class_id:
                continue

            polygon = _normalized_to_pixels(annotation.points, image.shape[1], image.shape[0])
            decimal_polygon = _decimal_polygon_from_reading(image, polygon)
            if decimal_polygon is None:
                continue

            decimal_lines.append(_format_annotation_line(decimal_class_id, decimal_polygon))

        if not decimal_lines:
            continue

        payload = raw_lines + decimal_lines
        label_path.write_text("\n".join(payload) + "\n", encoding="utf-8", newline="\n")
        updated_files += 1
        added_regions += len(decimal_lines)

    return updated_files, added_regions


def main() -> None:
    parser = argparse.ArgumentParser(description="Add decimal-region labels to a YOLO segmentation dataset")
    parser.add_argument("--input", required=True, help="Path to the source dataset root")
    parser.add_argument("--output", required=True, help="Path to write the updated dataset copy")
    args = parser.parse_args()

    source_root = Path(args.input).resolve()
    output_root = Path(args.output).resolve()

    if output_root.exists():
        shutil.rmtree(output_root)
    shutil.copytree(source_root, output_root)

    yaml_path = output_root / "data.yaml"
    yaml_payload = _load_yaml(yaml_path)
    names = list(yaml_payload.get("names", []))

    if READING_LABEL not in names:
        raise ValueError(f"Missing required class: {READING_LABEL}")

    if DECIMAL_LABEL in names:
        decimal_class_id = names.index(DECIMAL_LABEL)
    else:
        names.append(DECIMAL_LABEL)
        decimal_class_id = len(names) - 1

    reading_class_id = names.index(READING_LABEL)
    yaml_payload["names"] = names
    yaml_payload["nc"] = len(names)
    _save_yaml(yaml_path, yaml_payload)

    total_files = 0
    total_regions = 0
    for split_name in ("train", "valid", "test"):
        updated_files, added_regions = _process_split(output_root / split_name, reading_class_id, decimal_class_id)
        total_files += updated_files
        total_regions += added_regions
        print(f"{split_name}: updated {updated_files} label file(s), added {added_regions} decimal region(s)")

    print(f"Done. Added {total_regions} decimal region(s) across {total_files} file(s).")
    print(f"Updated dataset: {output_root}")


if __name__ == "__main__":
    main()
