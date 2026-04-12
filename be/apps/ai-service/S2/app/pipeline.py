from __future__ import annotations

from typing import Dict, List
import os
import re

import cv2
import numpy as np

from config.settings import Settings
from detector.yolo_detector import YOLODetector
from ocr.paddle_engine import OCREngine


METER_LABELS = {"meter", "Meter_region"}
READING_LABEL = "Current_pointer_reading_region"
DECIMAL_LABEL = "Current_pointer_decimal_region"
SERIAL_LABEL = "Serial_number_region"
TEXT_WINDOW_LABELS = {READING_LABEL, SERIAL_LABEL}


def _boxes_overlap(box1, box2):
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
    """
    Match the decimal-region detection that best belongs to a reading box.

    Expected geometry:
    - decimal box overlaps the reading box
    - decimal box is on the right side of the reading window
    """
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
        score = overlap_ratio + detection["conf"]
        candidates.append((score, detection))

    if not candidates:
        return None

    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates[0][1]


def _crop_reading_before_decimal(image, reading_box, decimal_detection, pad: int):
    """
    Crop the reading region and cut away the decimal box on the right if present.
    """
    x1, y1, x2, y2 = reading_box
    x1 = max(x1 - pad, 0)
    y1 = max(y1 - pad, 0)
    x2 = min(image.shape[1], x2 + pad)
    y2 = min(image.shape[0], y2 + pad)

    if decimal_detection is not None:
        decimal_x1 = decimal_detection["box"][0]
        cut_margin = max(2, pad)
        x2 = min(x2, max(x1 + 1, decimal_x1 - cut_margin))

    return image[y1:y2, x1:x2]


def _effective_reading_yolo_conf(reading_conf: float, decimal_detection) -> float:
    """
    The final reading OCR crop depends on both the reading box and decimal box.
    Use a simple 50/50 average so the reported confidence reflects both detections.
    """
    if decimal_detection is None:
        return reading_conf

    decimal_conf = decimal_detection["conf"]
    return (max(0.0, reading_conf) * 0.5) + (max(0.0, decimal_conf) * 0.5)


def _normalize_numeric_text(text: str) -> str:
    """
    Normalize text for numeric fields such as meter readings.
    """
    text = text.upper()
    text = text.replace("O", "0")
    text = text.replace("I", "1")
    text = text.replace("L", "1")
    text = text.replace("S", "5")
    text = text.replace("B", "8")
    return text


def _sanitize_serial_text(text: str) -> str:
    """
    Serial may contain letters and digits, so keep A-Z and 0-9 only.
    """
    return re.sub(r"[^A-Z0-9]", "", text.upper())


def _extract_digits(text: str) -> str:
    return "".join(re.findall(r"\d", text))


def _extract_reading_integer(raw_text: str) -> str:
    """
    Keep only the integer part of the reading.
    - If OCR returns 1234.56 or 1234,56 -> keep 1234
    - Handle common OCR artifacts like embedded spaces, dashes
    - Water meter counters have 5 integer digits + 1-3 decimal digits.
      When OCR reads the full counter (6-8 digits starting with leading zeros),
      extract only the first 5 digits (the integer part).
    """
    normalized = _normalize_numeric_text(raw_text)
    sanitized = re.sub(r"[^0-9.,\s\-]", "", normalized)
    if not sanitized:
        return ""

    # Split on decimal separators first
    if "." in sanitized or "," in sanitized:
        integer_part = re.split(r"[.,]", sanitized, maxsplit=1)[0]
    else:
        integer_part = sanitized

    digits = _extract_digits(integer_part)

    if 6 <= len(digits) <= 8 and digits[0] == "0":
        digits = digits[:5]
    elif len(digits) > 6:
        # Safety truncation for very long results
        digits = digits[:5]

    return digits


def _is_valid_serial(text: str) -> bool:
    return bool(re.fullmatch(r"[A-Z0-9]{5,12}", text))


def _is_valid_barcode_serial(text: str) -> bool:
    return bool(re.fullmatch(r"\d{5,12}", text))


def _is_valid_reading(text: str) -> bool:
    return bool(re.fullmatch(r"\d{1,8}", text))


def _serial_has_barcode_hint(texts) -> bool:
    """
    Treat a serial crop as barcode-style when OCR can see a strong numeric-only line.
    """
    for raw_text, conf in texts:
        cleaned = _sanitize_serial_text(raw_text)
        if not cleaned:
            continue
        if conf >= 0.5 and _is_valid_barcode_serial(cleaned):
            return True
    return False


def _select_serial_joined(texts) -> str:
    """
    Serial rules:
    - If the serial area contains a barcode, use the first numeric line below the barcode
    - If there is no barcode, keep the full alphanumeric serial string
    - Always remove special characters
    """
    if not texts:
        return ""

    cleaned_lines = []
    for raw_text, conf in texts:
        cleaned = _sanitize_serial_text(raw_text)
        if cleaned:
            cleaned_lines.append((cleaned, conf))

    if not cleaned_lines:
        return ""

    if _serial_has_barcode_hint(texts):
        for cleaned, conf in cleaned_lines:
            if conf >= 0.5 and _is_valid_barcode_serial(cleaned):
                return cleaned

        numeric_candidates = [
            (cleaned, conf)
            for cleaned, conf in cleaned_lines
            if _extract_digits(cleaned)
        ]
        if numeric_candidates:
            return max(numeric_candidates, key=lambda item: (len(item[0]), item[1]))[0]

    strong_fragments = [
        cleaned
        for cleaned, conf in cleaned_lines
        if conf >= 0.55
    ]
    merged = _sanitize_serial_text("".join(strong_fragments))
    if _is_valid_serial(merged):
        return merged

    whole_line_candidates = []
    for cleaned, conf in cleaned_lines:
        if conf >= 0.5 and _is_valid_serial(cleaned):
            score = conf + (len(cleaned) * 0.05)
            if re.search(r"[A-Z]", cleaned):
                score += 0.1
            whole_line_candidates.append((score, cleaned))

    if whole_line_candidates:
        whole_line_candidates.sort(key=lambda item: item[0], reverse=True)
        return whole_line_candidates[0][1]

    return max(cleaned_lines, key=lambda item: (item[1], len(item[0])))[0]


def _select_reading_joined(texts) -> str:
    """
    Reading rules:
    - Only keep the integer part
    - Do not concatenate integer part with red decimal digits
    - Always remove special characters
    - Prefer readings in realistic range (1-5 digits for typical water meters)
    - When multiple short fragments are detected, try concatenating them
    """
    if not texts:
        return ""

    candidates = []
    fallback = []

    for index, (raw_text, conf) in enumerate(texts):
        integer_part = _extract_reading_integer(raw_text)
        if not integer_part:
            continue

        # Strip leading zeros early so length scoring is accurate
        stripped = integer_part.lstrip("0") or "0"

        fallback.append((index, conf, stripped))

        if _is_valid_reading(stripped):
            # Realistic water meter readings are 1-5 digits (0 to 99999 m³)
            length = len(stripped)
            if 1 <= length <= 3:
                length_bonus = 0.3
            elif length == 4:
                length_bonus = 0.15
            elif length == 5:
                length_bonus = 0.1
            elif length == 6:
                length_bonus = 0.05
            else:
                length_bonus = -0.2 * (length - 6)

            # Earlier lines are preferred because decimal chunks usually appear later.
            score = conf + length_bonus - index * 0.05
            candidates.append((score, stripped))

    # Also try concatenating all confident short fragments (det=True often
    # fragments meter digits into separate text boxes)
    if len(fallback) > 1:
        confident_fragments = [
            (idx, conf, digits)
            for idx, conf, digits in fallback
            if conf >= 0.35 and len(digits) <= 3
        ]
        if len(confident_fragments) >= 2:
            # Sort by position (index) to maintain reading order
            confident_fragments.sort(key=lambda x: x[0])
            concatenated = "".join(d for _, _, d in confident_fragments)
            concatenated = concatenated.lstrip("0") or "0"
            avg_conf = sum(c for _, c, _ in confident_fragments) / len(confident_fragments)
            if _is_valid_reading(concatenated) and 2 <= len(concatenated) <= 5:
                # Apply full scoring: length bonus + multi-fragment bonus
                concat_score = avg_conf + 0.3 + 0.15
                candidates.append((concat_score, concatenated))

    if candidates:
        candidates.sort(key=lambda item: item[0], reverse=True)
        return candidates[0][1]

    if fallback:
        # Prefer moderate lengths over very long ones
        fallback.sort(key=lambda item: (
            -(5 - abs(len(item[2]) - 3)),  # prefer 1-5 digit results
            item[0],
            -item[1]
        ))
        return fallback[0][2]

    return ""


def _score_text_variant(label: str, texts) -> float:
    if not texts:
        return -1.0

    score = get_ocr_conf(texts)

    if label == SERIAL_LABEL:
        joined = _select_serial_joined(texts)
        if joined:
            if _serial_has_barcode_hint(texts):
                if _is_valid_barcode_serial(joined):
                    score += 1.0
                else:
                    score += min(len(joined), 12) * 0.05
            else:
                if _is_valid_serial(joined):
                    score += 1.0
                else:
                    score += min(len(joined), 12) * 0.05
        return score

    if label == READING_LABEL:
        joined = _select_reading_joined(texts)
        if joined:
            if _is_valid_reading(joined):
                length = len(joined)
                if 2 <= length <= 3:
                    score += 1.0
                elif length == 4:
                    score += 0.8  # 4-digit readings are rare (3.8% of GT)
                elif length == 1:
                    score += 0.4  # single digit is plausible but suspicious
                elif length == 5:
                    score += 0.7  # 5-digit readings are rare, often wrong
                elif length <= 6:
                    score += 0.5
                else:
                    score += 0.2
            else:
                score += min(len(joined), 8) * 0.05
        return score

    joined = " ".join(text for text, conf in texts if conf > 0.8)
    if joined:
        score += min(len(joined), 20) * 0.02
    return score


def get_ocr_conf(texts):
    if not texts:
        return 0.0
    return max(conf for _, conf in texts)


def get_heuristic_score(label, texts, joined, box, meter_box):
    score = 0.0

    if label == SERIAL_LABEL:
        if joined:
            score += 0.25

        if _serial_has_barcode_hint(texts):
            if _is_valid_barcode_serial(joined):
                score += 0.25
        else:
            if _is_valid_serial(joined):
                score += 0.25

    elif label == READING_LABEL:
        if joined:
            score += 0.25

        if _is_valid_reading(joined):
            score += 0.25

    if meter_box and _boxes_overlap(box, meter_box):
        score += 0.25

    valid_texts = [text for text, conf in texts if conf > 0.8]
    if len(valid_texts) <= 2:
        score += 0.25

    return score


def _detect_red_boundary(crop) -> int | None:
    """
    Detect the x-coordinate where red (decimal) digits start in a reading crop.
    Uses HSV color space to find the red-colored digit region typically present
    in the decimal portion of mechanical water meter counters.
    Returns the x position or None if no red region detected.
    """
    if crop is None or crop.size == 0 or len(crop.shape) < 3:
        return None

    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    # Red hue in HSV wraps around 0/180
    mask_low = (h <= 15) & (s >= 80) & (v >= 50)
    mask_high = (h >= 165) & (s >= 80) & (v >= 50)
    red_mask = (mask_low | mask_high).astype(np.float32)

    height, width = crop.shape[:2]
    if width < 20:
        return None

    col_strength = red_mask.mean(axis=0)

    # Only search in the right 60% — decimal digits are always on the right
    search_start = int(width * 0.35)
    threshold = 0.10

    for x in range(search_start, width):
        if col_strength[x] > threshold:
            return max(0, x - 2)

    return None


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

            if label == READING_LABEL:
                # CLAHE enhanced — improves contrast on dirty/faded meters
                clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
                enhanced = clahe.apply(gray)
                variants.append(cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR))

                # Otsu binary — clean threshold for mechanical digit counters
                _, otsu = cv2.threshold(
                    gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
                )
                variants.append(cv2.cvtColor(otsu, cv2.COLOR_GRAY2BGR))

                # Bilateral filter — reduce noise while preserving edges (digit borders)
                bilateral = cv2.bilateralFilter(crop, 9, 75, 75)
                variants.append(bilateral)

                # Sharpen — unsharp mask for blurry meter photos
                blurred = cv2.GaussianBlur(gray, (0, 0), 3)
                sharpened = cv2.addWeighted(gray, 1.5, blurred, -0.5, 0)
                variants.append(cv2.cvtColor(sharpened, cv2.COLOR_GRAY2BGR))

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

        # For reading: try recognition-only (det=False) on original crop
        # as an alternative — avoids text detection fragmenting digits
        if label == READING_LABEL:
            det_false_texts = self.ocr.read_text_crop(crop)
            det_false_score = _score_text_variant(label, det_false_texts)
            if det_false_score > best_score:
                best_crop = crop
                best_texts = det_false_texts
                best_score = det_false_score

        return best_crop, best_texts

    def _read_reading_with_cell_split(self, crop, num_cells: int = 5):
        cell_results = self.ocr.read_text_cells(crop, num_cells=num_cells)
        if not cell_results:
            return []

        digits = []
        confs = []
        for text, conf in cell_results:
            normalized = _normalize_numeric_text(text)
            d = _extract_digits(normalized)
            if d:
                digits.append(d[0])  # take first digit only
                confs.append(conf)
            else:
                digits.append("")
                confs.append(0.0)

        joined = "".join(digits)
        if not joined:
            return []

        avg_conf = sum(confs) / max(len(confs), 1)
        return [(joined, avg_conf)]

    def process_reading_crop(self, image) -> Dict[str, object]:
        """
        OCR-only probe for a reading crop.

        This bypasses YOLO detection completely and applies only the OCR + reading
        post-processing logic on the supplied image crop.
        """
        if image is None or image.size == 0:
            return {
                "label": READING_LABEL,
                "text": "",
                "ocr_conf": 0.0,
                "heuristic": 0.0,
                "final_conf": 0.0,
                "raw_texts": [],
            }

        # Adaptive upscaling
        h, w = image.shape[:2]
        min_dim = min(h, w)
        if min_dim < 32:
            scale = max(4, 128 // max(min_dim, 1))
        elif min_dim < 64:
            scale = 3
        else:
            scale = 2
        crop = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

        # Red boundary fallback
        red_x = _detect_red_boundary(crop)
        if red_x is not None and red_x > crop.shape[1] * 0.3:
            crop = crop[:, :red_x]

        _, texts = self._read_text_with_variants(READING_LABEL, crop)

        # Cell-based fallback
        main_joined = _select_reading_joined(texts) if texts else ""
        main_score = _score_text_variant(READING_LABEL, texts)
        if main_score < 1.0 or not main_joined or len(main_joined) > 6:
            crop_h, crop_w = crop.shape[:2]
            aspect = crop_w / max(crop_h, 1)
            num_cells = min(8, max(3, round(aspect * 1.2))) if aspect > 3 else 5
            cell_texts = self._read_reading_with_cell_split(crop, num_cells=num_cells)
            cell_score = _score_text_variant(READING_LABEL, cell_texts)
            cell_joined = _select_reading_joined(cell_texts) if cell_texts else ""
            if cell_joined and (cell_score > main_score or not main_joined):
                texts = cell_texts

        joined = _select_reading_joined(texts) if texts else ""
        ocr_conf = get_ocr_conf(texts)
        box = [0, 0, image.shape[1], image.shape[0]]
        heuristic = get_heuristic_score(
            label=READING_LABEL,
            texts=texts,
            joined=joined,
            box=box,
            meter_box=None,
        )
        final_conf = (ocr_conf * 0.8) + (heuristic * 0.2)
        final_conf = max(0, min(1, final_conf))

        return {
            "label": READING_LABEL,
            "text": joined,
            "ocr_conf": round(ocr_conf, 3),
            "heuristic": round(heuristic, 3),
            "final_conf": round(final_conf, 3),
            "raw_texts": texts,
        }

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
        decimal_detections = [
            detection for detection in detections if detection["label"] == DECIMAL_LABEL
        ]
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

            if label == DECIMAL_LABEL:
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
                # Use larger padding for reading to avoid cutting off edge digits
                pad = max(3, min(8, int(min(width, height) * 0.08)))
            else:
                pad = 10

            x1 = max(x1 - pad, 0)
            y1 = max(y1 - pad, 0)
            x2 = min(image.shape[1], x2 + pad)
            y2 = min(image.shape[0], y2 + pad)

            if label == READING_LABEL:
                decimal_detection = _select_decimal_detection_for_reading(box, decimal_detections)
                crop = _crop_reading_before_decimal(image, box, decimal_detection, pad)
                effective_yolo_conf = _effective_reading_yolo_conf(conf, decimal_detection)
                reading_yolo_conf = conf
                decimal_yolo_conf = decimal_detection["conf"] if decimal_detection is not None else None

                # Fallback decimal split: if YOLO missed the decimal region,
                # detect red digits in the crop and cut them off
                if decimal_detection is None and crop is not None and crop.size > 0:
                    red_x = _detect_red_boundary(crop)
                    if red_x is not None and red_x > crop.shape[1] * 0.3:
                        crop = crop[:, :red_x]
            else:
                crop = image[y1:y2, x1:x2]
                effective_yolo_conf = conf
                reading_yolo_conf = None
                decimal_yolo_conf = None

            if crop.size == 0:
                continue

            # Adaptive upscaling: ensure minimum size for OCR quality
            crop_h, crop_w = crop.shape[:2]
            min_dim = min(crop_h, crop_w)
            if min_dim < 32:
                scale = max(4, 128 // max(min_dim, 1))
            elif min_dim < 64:
                scale = 3
            else:
                scale = 2
            crop = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
            crop, texts = self._read_text_with_variants(label, crop)

            # For reading: if main OCR gave poor results, try cell-splitting strategy
            if label == READING_LABEL:
                main_joined = _select_reading_joined(texts) if texts else ""
                main_score = _score_text_variant(READING_LABEL, texts)

                # Determine number of cells from crop aspect ratio
                crop_h, crop_w = crop.shape[:2]
                aspect = crop_w / max(crop_h, 1)
                if aspect > 3:
                    num_cells = min(8, max(3, round(aspect * 1.2)))
                else:
                    num_cells = 5

                # Try cell-based OCR if main result is weak or suspiciously long
                try_cells = (
                    main_score < 1.0
                    or not main_joined
                    or len(main_joined) > 6
                )
                if try_cells:
                    cell_texts = self._read_reading_with_cell_split(crop, num_cells=num_cells)
                    cell_score = _score_text_variant(READING_LABEL, cell_texts)
                    cell_joined = _select_reading_joined(cell_texts) if cell_texts else ""

                    # Prefer cell result if it looks more reasonable
                    if cell_joined and cell_score > main_score:
                        texts = cell_texts
                    elif cell_joined and not main_joined:
                        texts = cell_texts

                # Wider-crop retry: when result is suspiciously short (1-2 digits),
                # expand the YOLO box by 25% and re-OCR to capture edge digits
                retry_joined = _select_reading_joined(texts) if texts else ""
                if retry_joined and 1 <= len(retry_joined) <= 2:
                    orig_x1, orig_y1, orig_x2, orig_y2 = box
                    orig_w = orig_x2 - orig_x1
                    orig_h = orig_y2 - orig_y1
                    expand_x = max(10, int(orig_w * 0.25))
                    expand_y = max(5, int(orig_h * 0.15))

                    wide_x1 = max(0, orig_x1 - expand_x)
                    wide_y1 = max(0, orig_y1 - expand_y)
                    wide_x2 = min(image.shape[1], orig_x2 + expand_x)
                    wide_y2 = min(image.shape[0], orig_y2 + expand_y)

                    # Apply decimal boundary on wider crop
                    if decimal_detection is not None:
                        dec_x1 = decimal_detection["box"][0]
                        wide_x2 = min(wide_x2, max(wide_x1 + 1, dec_x1 - max(2, pad)))

                    wide_crop = image[wide_y1:wide_y2, wide_x1:wide_x2]
                    if wide_crop.size > 0:
                        # Red boundary fallback on wider crop
                        wide_red_x = _detect_red_boundary(wide_crop)
                        if wide_red_x is not None and wide_red_x > wide_crop.shape[1] * 0.3:
                            wide_crop = wide_crop[:, :wide_red_x]

                        # Upscale wider crop
                        wh, ww = wide_crop.shape[:2]
                        w_min = min(wh, ww)
                        if w_min < 32:
                            w_scale = max(4, 128 // max(w_min, 1))
                        elif w_min < 64:
                            w_scale = 3
                        else:
                            w_scale = 2
                        wide_crop = cv2.resize(wide_crop, None, fx=w_scale, fy=w_scale,
                                               interpolation=cv2.INTER_CUBIC)

                        _, wide_texts = self._read_text_with_variants(READING_LABEL, wide_crop)
                        wide_joined = _select_reading_joined(wide_texts) if wide_texts else ""
                        wide_score = _score_text_variant(READING_LABEL, wide_texts)
                        curr_score = _score_text_variant(READING_LABEL, texts)

                        # Use wider crop if it gives a longer result with competitive score
                        # For 2-digit source: require noticeably better score (avoid overriding correct short readings)
                        # For 1-digit source: permissive threshold (almost certainly wrong)
                        score_threshold = curr_score - 0.1  # DEBUG: permissive to log all cases
                        print(f"[WIDER_CROP] orig='{retry_joined}' wide='{wide_joined}' "
                              f"curr_score={curr_score:.3f} wide_score={wide_score:.3f} "
                              f"threshold={score_threshold:.3f} "
                              f"accept={wide_joined and len(wide_joined) >= 3 and wide_score >= score_threshold}")
                        if wide_texts:
                            for wt, wc in wide_texts:
                                print(f"  wide_text: '{wt}' conf={wc:.3f}")
                        if (wide_joined and len(wide_joined) >= 3
                                and wide_score >= score_threshold):
                            texts = wide_texts


            debug_dir = "debug_crops"
            os.makedirs(debug_dir, exist_ok=True)
            crop_path = os.path.join(debug_dir, f"{label}_{conf:.2f}.jpg")
            cv2.imwrite(crop_path, crop)
            print(f"Saved crop to {crop_path} (size: {width}x{height})")

            joined = ""
            if texts:
                if label == SERIAL_LABEL:
                    joined = _select_serial_joined(texts)
                elif label == READING_LABEL:
                    joined = _select_reading_joined(texts)
                else:
                    filtered_texts = [text for text, text_conf in texts if text_conf > 0.8]
                    joined = "".join(filtered_texts)

            if label == READING_LABEL:
                print(
                    f"Detected {label} with reading_conf={reading_yolo_conf}, "
                    f"decimal_conf={decimal_yolo_conf}, yolo_conf={effective_yolo_conf}: '{joined}'"
                )
            else:
                print(f"Detected {label} with conf {conf}: '{joined}'")

            ocr_conf = get_ocr_conf(texts)
            heuristic = get_heuristic_score(
                label=label,
                texts=texts,
                joined=joined,
                box=box,
                meter_box=meter_box,
            )

            final_conf = (effective_yolo_conf * 0.45) + (ocr_conf * 0.45) + (heuristic * 0.10)
            final_conf = max(0, min(1, final_conf))

            results.append(
                {
                    "box": box,
                    "label": label,
                    "text": joined,
                    "yolo_conf": round(effective_yolo_conf, 3),
                    "reading_yolo_conf": round(reading_yolo_conf, 3) if reading_yolo_conf is not None else None,
                    "decimal_yolo_conf": round(decimal_yolo_conf, 3) if decimal_yolo_conf is not None else None,
                    "ocr_conf": round(ocr_conf, 3),
                    "heuristic": round(heuristic, 3),
                    "final_conf": round(final_conf, 3),
                    "raw_texts": texts,
                }
            )

        # Fallback: if no reading was found but we have a meter region,
        # try OCR on the central portion of the meter (where readings usually are)
        has_reading = any(r["label"] == READING_LABEL for r in results)
        if not has_reading and meter_box is not None:
            mx1, my1, mx2, my2 = meter_box
            mw = mx2 - mx1
            mh = my2 - my1

            # Reading window is typically in the upper-center of the meter
            fx1 = mx1 + int(mw * 0.15)
            fy1 = my1 + int(mh * 0.10)
            fx2 = mx2 - int(mw * 0.10)
            fy2 = my1 + int(mh * 0.50)

            fx1 = max(0, fx1)
            fy1 = max(0, fy1)
            fx2 = min(image.shape[1], fx2)
            fy2 = min(image.shape[0], fy2)

            if fx2 > fx1 + 20 and fy2 > fy1 + 10:
                fallback_crop = image[fy1:fy2, fx1:fx2]

                # Red boundary to cut decimal
                red_x = _detect_red_boundary(fallback_crop)
                if red_x is not None and red_x > fallback_crop.shape[1] * 0.3:
                    fallback_crop = fallback_crop[:, :red_x]

                fb_h, fb_w = fallback_crop.shape[:2]
                fb_scale = max(2, 128 // max(min(fb_h, fb_w), 1))
                fallback_crop = cv2.resize(
                    fallback_crop, None, fx=fb_scale, fy=fb_scale,
                    interpolation=cv2.INTER_CUBIC
                )

                _, fb_texts = self._read_text_with_variants(READING_LABEL, fallback_crop)
                fb_joined = _select_reading_joined(fb_texts) if fb_texts else ""

                if fb_joined and _is_valid_reading(fb_joined):
                    fb_ocr_conf = get_ocr_conf(fb_texts)
                    fb_box = (fx1, fy1, fx2, fy2)
                    fb_heuristic = get_heuristic_score(
                        READING_LABEL, fb_texts, fb_joined, fb_box, meter_box
                    )
                    fb_final = (0.2 * 0.45) + (fb_ocr_conf * 0.45) + (fb_heuristic * 0.10)
                    fb_final = max(0, min(1, fb_final))
                    results.append({
                        "box": fb_box,
                        "label": READING_LABEL,
                        "text": fb_joined,
                        "yolo_conf": 0.2,
                        "reading_yolo_conf": None,
                        "decimal_yolo_conf": None,
                        "ocr_conf": round(fb_ocr_conf, 3),
                        "heuristic": round(fb_heuristic, 3),
                        "final_conf": round(fb_final, 3),
                        "raw_texts": fb_texts,
                    })

        # Deduplicate reading detections: keep only the best reading result
        reading_results = [r for r in results if r["label"] == READING_LABEL and r.get("text")]
        if len(reading_results) > 1:
            # Pick the best reading by final_conf
            best_reading = max(reading_results, key=lambda r: r.get("final_conf", 0))
            results = [r for r in results if r["label"] != READING_LABEL or r is best_reading]
            # Re-add empty readings that were not candidates
            for r in [r for r in reading_results if not r.get("text")]:
                if r not in results:
                    results.append(r)

        return results
