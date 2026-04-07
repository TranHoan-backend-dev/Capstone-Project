from __future__ import annotations

from typing import Dict, List
import os
import re

import cv2

from config.settings import Settings
from detector.yolo_detector import YOLODetector
from ocr.paddle_engine import OCREngine


METER_LABELS = {"meter", "Meter_region"}
TEXT_WINDOW_LABELS = {"Current_pointer_reading_region", "Serial_number_region"}


def _boxes_overlap(box1, box2):
    x1a, y1a, x2a, y2a = box1
    x1b, y1b, x2b, y2b = box2
    return not (x2a < x1b or x2b < x1a or y2a < y1b or y2b < y1a)


def _normalize_ocr_text(text: str) -> str:
    text = text.upper()
    text = text.replace("O", "0")
    text = text.replace("S", "5")
    text = text.replace("B", "8")
    return text


def _extract_numbers(text: str) -> str:
    return "".join(re.findall(r"\d", _normalize_ocr_text(text)))


def _expected_digit_range(label: str) -> tuple[int, int]:
    if label == "Serial_number_region":
        return 6, 10
    if label == "Current_pointer_reading_region":
        return 5, 8
    return 1, 64


def _select_numeric_joined(label: str, texts) -> str:
    if not texts:
        return ""

    min_len, max_len = _expected_digit_range(label)
    full_candidates = []
    fragments = []

    for raw_text, conf in texts:
        digits = _extract_numbers(raw_text)
        if not digits:
            continue

        if min_len <= len(digits) <= max_len and conf >= 0.6:
            # Prefer complete numeric candidates that already look valid.
            score = conf + (len(digits) * 0.1)
            full_candidates.append((score, digits))

        # Keep shorter chunks too so they can be stitched back together.
        if conf >= 0.65 or len(digits) >= 3:
            fragments.append(digits)

    if full_candidates:
        full_candidates.sort(key=lambda item: item[0], reverse=True)
        return full_candidates[0][1]

    merged = "".join(fragments)
    if merged:
        if len(merged) <= max_len + 2:
            return merged
        return max(fragments, key=len)

    return ""


def _score_text_variant(label: str, texts) -> float:
    if not texts:
        return -1.0

    joined = _select_numeric_joined(label, texts)
    score = get_ocr_conf(texts)
    has_alpha = any(re.search(r"[A-Z]", _normalize_ocr_text(text)) for text, _ in texts)
    min_len, max_len = _expected_digit_range(label)

    if joined:
        if min_len <= len(joined) <= max_len:
            score += 1.0
        else:
            score += min(len(joined), max_len) * 0.05

    if has_alpha:
        score -= 0.25

    return score


def get_ocr_conf(texts):
    if not texts:
        return 0.0
    return max(conf for _, conf in texts)


def get_heuristic_score(label, texts, joined, box, meter_box):
    score = 0.0

    has_alpha = any(re.search(r"[A-Z]", _normalize_ocr_text(text)) for text, _ in texts)
    if not has_alpha:
        score += 0.25

    if label == "Serial_number_region":
        if re.fullmatch(r"\d{6,10}", joined):
            score += 0.25
    elif label == "Current_pointer_reading_region":
        if re.fullmatch(r"\d{5,8}", joined):
            score += 0.25

    if meter_box and _boxes_overlap(box, meter_box):
        score += 0.25

    valid_texts = [text for text, conf in texts if conf > 0.8]
    if len(valid_texts) <= 2:
        score += 0.25

    return score


class OCRPipeline:
    def __init__(self, settings: Settings | None = None):
        self.settings = settings or Settings()

        self.detector = YOLODetector(
            weights_path=self.settings.yolo_weights_path,
            conf=self.settings.yolo_conf,
            iou=self.settings.yolo_iou,
            device=self.settings.yolo_device,
            img_size=self.settings.yolo_img_size,
            quantize=self.settings.yolo_quantize,
        )

        self.ocr = OCREngine(
            lang=self.settings.ocr_lang,
            use_angle_cls=self.settings.ocr_use_angle_cls,
            use_det=self.settings.ocr_use_det,
        )

    def process_batch(self, images) -> List[List[Dict[str, object]]]:
        return [self.process(image) for image in images]

    def _read_text_with_variants(self, label: str, crop):
        variants = [crop]

        if label in TEXT_WINDOW_LABELS:
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            variants.append(cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR))

            height, width = crop.shape[:2]
            if height > width * 1.2:
                rotated_variants = []
                for variant in variants:
                    rotated_variants.append(cv2.rotate(variant, cv2.ROTATE_90_CLOCKWISE))
                    rotated_variants.append(cv2.rotate(variant, cv2.ROTATE_90_COUNTERCLOCKWISE))
                variants.extend(rotated_variants)

        best_crop = crop
        best_texts = []
        best_score = -1.0

        for variant in variants:
            texts = self.ocr.read_text(variant)
            score = _score_text_variant(label, texts)
            if score > best_score:
                best_crop = variant
                best_texts = texts
                best_score = score

        return best_crop, best_texts

    def process(self, image) -> List[Dict[str, object]]:
        detections = self.detector.detect(image)

        detections = sorted(
            detections,
            key=lambda detection: (
                (detection["box"][2] - detection["box"][0])
                * (detection["box"][3] - detection["box"][1])
            ),
            reverse=True,
        )

        meter_box = None
        max_area = 0
        for detection in detections:
            if detection["label"] in METER_LABELS:
                x1, y1, x2, y2 = detection["box"]
                area = (x2 - x1) * (y2 - y1)
                if area > max_area:
                    max_area = area
                    meter_box = detection["box"]

        results: List[Dict[str, object]] = []

        for detection in detections:
            box = detection["box"]
            conf = detection["conf"]
            label = detection["label"]

            if label in METER_LABELS:
                results.append(
                    {
                        "box": box,
                        "label": "meter",
                        "text": "",
                        "conf": conf,
                        "raw_texts": [],
                    }
                )
                continue

            if meter_box and not _boxes_overlap(box, meter_box):
                continue

            x1, y1, x2, y2 = box
            width = x2 - x1
            height = y2 - y1
            if width < self.settings.crop_min_width or height < self.settings.crop_min_height:
                continue

            image_height, image_width = image.shape[:2]
            if (width * height) > 0.5 * image_width * image_height:
                continue

            if label in TEXT_WINDOW_LABELS:
                pad = max(2, min(4, int(min(width, height) * 0.03)))
            else:
                pad = 10

            x1 = max(x1 - pad, 0)
            y1 = max(y1 - pad, 0)
            x2 = min(image.shape[1], x2 + pad)
            y2 = min(image.shape[0], y2 + pad)

            crop = image[y1:y2, x1:x2]
            crop = cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
            crop, texts = self._read_text_with_variants(label, crop)

            debug_dir = "debug_crops"
            os.makedirs(debug_dir, exist_ok=True)
            crop_path = os.path.join(debug_dir, f"{label}_{conf:.2f}.jpg")
            cv2.imwrite(crop_path, crop)
            print(f"Saved crop to {crop_path} (size: {width}x{height})")

            joined = ""
            if texts:
                if label in TEXT_WINDOW_LABELS:
                    joined = _select_numeric_joined(label, texts)
                else:
                    filtered_texts = [text for text, text_conf in texts if text_conf > 0.8]
                    joined = " ".join(filtered_texts)

            if label == "Serial_number_region":
                joined = _extract_numbers(joined)

            print(f"Detected {label} with conf {conf}: '{joined}'")

            ocr_conf = get_ocr_conf(texts)
            heuristic = get_heuristic_score(
                label=label,
                texts=texts,
                joined=joined,
                box=box,
                meter_box=meter_box,
            )

            final_conf = (conf * 0.45) + (ocr_conf * 0.45) + (heuristic * 0.10)
            final_conf = max(0, min(1, final_conf))

            results.append(
                {
                    "box": box,
                    "label": label,
                    "text": joined,
                    "yolo_conf": conf,
                    "ocr_conf": round(ocr_conf, 3),
                    "heuristic": round(heuristic, 3),
                    "final_conf": round(final_conf, 3),
                    "raw_texts": texts,
                }
            )

        return results
