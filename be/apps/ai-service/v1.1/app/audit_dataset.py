from __future__ import annotations

import argparse
import ast
import csv
import os
import random
from typing import Iterable

import cv2
import numpy as np


def _load_rows(csv_path: str) -> list[dict[str, str]]:
    with open(csv_path, "r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def _parse_polygon(raw_location: str) -> list[tuple[int, int]]:
    payload = ast.literal_eval(raw_location)
    points = payload.get("data", [])
    parsed = []
    for point in points:
        parsed.append((float(point["x"]), float(point["y"])))
    return parsed


def _scale_polygon(points: Iterable[tuple[float, float]], width: int, height: int) -> list[tuple[int, int]]:
    return [(int(x * width), int(y * height)) for x, y in points]


def _draw_overlay(image, photo_name: str, value: str, polygon: list[tuple[int, int]]):
    vis = image.copy()

    if polygon:
        contour = np.array(polygon, dtype=np.int32).reshape((-1, 1, 2))
        cv2.polylines(vis, [contour], True, (0, 255, 0), 2)

        anchor_x = max(min(point[0] for point in polygon), 5)
        anchor_y = max(min(point[1] for point in polygon) - 10, 20)
    else:
        anchor_x = 10
        anchor_y = 30

    title = f"{photo_name} | value={value}"
    cv2.rectangle(vis, (anchor_x, anchor_y - 20), (min(anchor_x + 520, vis.shape[1] - 5), anchor_y + 8), (0, 255, 0), -1)
    cv2.putText(
        vis,
        title,
        (anchor_x + 4, anchor_y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (0, 0, 0),
        1,
        cv2.LINE_AA,
    )

    return vis


def _imread_unicode(path: str):
    try:
        data = np.fromfile(path, dtype=np.uint8)
        if data.size == 0:
            return None
        return cv2.imdecode(data, cv2.IMREAD_COLOR)
    except Exception:
        return None


def _imwrite_unicode(path: str, image) -> bool:
    ext = os.path.splitext(path)[1] or ".jpg"
    ok, encoded = cv2.imencode(ext, image)
    if not ok:
        return False
    encoded.tofile(path)
    return True


def _select_rows(rows: list[dict[str, str]], sample_size: int, seed: int, photo_names: list[str]) -> list[dict[str, str]]:
    if photo_names:
        wanted = {name.strip() for name in photo_names if name.strip()}
        selected = [row for row in rows if row["photo_name"] in wanted]
        return selected

    if sample_size <= 0 or sample_size >= len(rows):
        return rows

    rng = random.Random(seed)
    return rng.sample(rows, sample_size)


def main():
    parser = argparse.ArgumentParser(description="Overlay WaterMeters CSV polygon/value on sample images for audit")
    parser.add_argument("--csv", required=True, help="Path to data.csv")
    parser.add_argument("--images", required=True, help="Path to images directory")
    parser.add_argument("--output-dir", required=True, help="Directory to save overlay images")
    parser.add_argument("--sample-size", type=int, default=50, help="Number of random samples to export")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducible sampling")
    parser.add_argument("--photo-name", action="append", default=[], help="Specific photo_name to export, can be passed multiple times")
    args = parser.parse_args()

    rows = _load_rows(args.csv)
    selected_rows = _select_rows(rows, args.sample_size, args.seed, args.photo_name)

    os.makedirs(args.output_dir, exist_ok=True)

    exported = 0
    skipped = 0

    for row in selected_rows:
        photo_name = row["photo_name"]
        image_path = os.path.join(args.images, photo_name)
        image = _imread_unicode(image_path)
        if image is None:
            skipped += 1
            print(f"Skipped missing image: {image_path}")
            continue

        polygon = _scale_polygon(_parse_polygon(row["location"]), image.shape[1], image.shape[0])
        vis = _draw_overlay(image, photo_name, row["value"], polygon)

        output_path = os.path.join(args.output_dir, photo_name)
        if _imwrite_unicode(output_path, vis):
            exported += 1
        else:
            skipped += 1
            print(f"Skipped failed write: {output_path}")

    print(f"Exported {exported} audit image(s) to: {args.output_dir}")
    if skipped:
        print(f"Skipped {skipped} missing image(s)")


if __name__ == "__main__":
    main()
