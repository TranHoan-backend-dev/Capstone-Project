from __future__ import annotations

import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import cv2

from config.settings import Settings
from pipeline import OCRPipeline
from app_utils.logger import get_logger


logger = get_logger("realtime")


def _resize_frame(frame, max_width: int):
    if max_width <= 0:
        return frame
    h, w = frame.shape[:2]
    if w <= max_width:
        return frame
    scale = max_width / float(w)
    new_w = max_width
    new_h = int(h * scale)
    return cv2.resize(frame, (new_w, new_h))


def _draw_results(frame, results, max_label_len: int):
    for res in results:
        x1, y1, x2, y2 = res["box"]
        label = res.get("label", "")
        text = res.get("text") or ""
        conf = res.get("conf", 0)
        display_text = f"{label}: {text} ({conf:.2f})"
        if len(display_text) > max_label_len:
            display_text = display_text[: max_label_len - 3] + "..."

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 0), 2)
        if display_text:
            cv2.rectangle(frame, (x1, y1 - 18), (x2, y1), (0, 200, 0), -1)
            cv2.putText(
                frame,
                display_text,
                (x1, y1 - 4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 0),
                1,
                cv2.LINE_AA,
            )


def main():
    settings = Settings()
    logger.info("Video source: %s", settings.video_source)
    logger.info("YOLO weights: %s", settings.yolo_weights_path)

    cap = cv2.VideoCapture(settings.video_source)
    if not cap.isOpened():
        raise RuntimeError("Cannot open video source")

    pipeline = OCRPipeline(settings)

    frame_index = 0
    quit_key_code = ord(settings.quit_key[:1])
    batch_size = max(1, settings.yolo_batch_size)
    frame_buffer = []

    def _flush_buffer() -> bool:
        if not frame_buffer:
            return False

        frames = [item[1] for item in frame_buffer]
        results_batch = pipeline.process_batch(frames)

        for (_, buffered_frame), results in zip(frame_buffer, results_batch):
            _draw_results(buffered_frame, results, settings.max_label_len)
            cv2.imshow(settings.window_name, buffered_frame)
            if cv2.waitKey(1) & 0xFF == quit_key_code:
                frame_buffer.clear()
                return True

        frame_buffer.clear()
        return False

    while True:
        ok, frame = cap.read()
        if not ok:
            logger.warning("Stream ended or frame not available")
            break

        frame_index += 1
        if settings.frame_stride > 1 and (frame_index % settings.frame_stride) != 0:
            continue

        frame = _resize_frame(frame, settings.frame_max_width)
        frame_buffer.append((frame_index, frame))

        if len(frame_buffer) < batch_size:
            continue

        if _flush_buffer():
            break

    if frame_buffer:
        _flush_buffer()

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
