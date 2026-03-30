from __future__ import annotations

import argparse
import json
import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import cv2

from config.settings import Settings
from pipeline import OCRPipeline


def _draw_results(frame, results, max_label_len: int):
    for res in results:
        x1, y1, x2, y2 = res["box"]
        text = res.get("text") or ""
        if len(text) > max_label_len:
            text = text[: max_label_len - 3] + "..."

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 0), 2)
        if text:
            cv2.rectangle(frame, (x1, y1 - 18), (x2, y1), (0, 200, 0), -1)
            cv2.putText(
                frame,
                text,
                (x1, y1 - 4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 0),
                1,
                cv2.LINE_AA,
            )


def main():
    parser = argparse.ArgumentParser(description="Run YOLOv5 + PaddleOCR on a single image")
    parser.add_argument("--image", "-i", required=True, help="Path to input image")
    parser.add_argument("--output", "-o", default="", help="Optional output image path")
    parser.add_argument("--show", action="store_true", help="Show image window")
    args = parser.parse_args()

    settings = Settings()
    pipeline = OCRPipeline(settings)

    image = cv2.imread(args.image)
    if image is None:
        raise FileNotFoundError(f"Cannot read image: {args.image}")

    results = pipeline.process(image)
    print(json.dumps(results, ensure_ascii=False, indent=2))

    if args.output or args.show:
        vis = image.copy()
        _draw_results(vis, results, settings.max_label_len)

        if args.output:
            cv2.imwrite(args.output, vis)

        if args.show:
            cv2.imshow(settings.window_name, vis)
            cv2.waitKey(0)
            cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
