from __future__ import annotations

from typing import Iterable, List
import inspect
import cv2
import numpy as np

from paddleocr import PaddleOCR


def _is_det_output(result) -> bool:
    if not result:
        return False
    first = result[0]
    return isinstance(first, list) and len(first) == 2 and isinstance(first[0], list)


class OCREngine:
    def __init__(self, lang: str = "en", use_angle_cls: bool = True, use_det: bool = False):
        self.ocr = PaddleOCR(use_angle_cls=use_angle_cls, lang=lang)
        self.use_angle_cls = use_angle_cls
        self.use_det = use_det
        # PaddleOCR v3 removed det/rec/cls kwargs; detect support at runtime.
        try:
            self._ocr_kwargs = set(inspect.signature(self.ocr.ocr).parameters.keys())
        except Exception:
            self._ocr_kwargs = set()

    def _preprocess_image(self, image) -> np.ndarray:
        """Preprocess image for better OCR: resize if too small, enhance contrast."""
        h, w = image.shape[:2]
        # If image is too small, upscale it (minimum 200px width for better recognition)
        if w < 200:
            scale = max(1, 200 / w)
            image = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        
        # Enhance contrast using CLAHE
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        lab = cv2.merge([l, a, b])
        image = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
        
        return image

    # def read_text(self, image) -> List[str]:
    #     # Preprocess image for better OCR
    #     image = self._preprocess_image(image)
        
    #     # Handle both PaddleOCR v2 (det/rec/cls kwargs) and v3 (kwargs removed).
    #     result = None
    #     if "det" in self._ocr_kwargs:
    #         if self.use_det:
    #             result = self.ocr.ocr(image)
    #         else:
    #             result = self.ocr.ocr(image, det=False, rec=True, cls=self.use_angle_cls)
    #     else:
    #         # v3 API: no det/rec/cls kwargs
    #         result = self.ocr.ocr(image)

    #     texts: List[str] = []
    #     if not result:
    #         return texts

    #     if _is_det_output(result):
    #         for line in result:
    #             for word in line:
    #                 if isinstance(word, list) and len(word) >= 2:
    #                     text = word[1][0]
    #                     if isinstance(text, str):
    #                         texts.append(text)
    #     else:
    #         for item in _flatten(result):
    #             text = _extract_text(item)
    #             if text:
    #                 texts.append(text)

    #     return texts

    def read_text(self, image):
        result = self.ocr.ocr(image, cls=True)

        texts = []

        if result is None:
            return texts

        for line in result:
            if line is None:
                continue
            for word in line:
                text = word[1][0]
                score = word[1][1]
                texts.append((text, score))

        return texts

    def read_text_crop(self, image):
        """
        Recognition-only OCR for pre-cropped text regions.
        Uses det=False to treat the entire image as a text line,
        avoiding text-detection artifacts on meter digit displays.
        Adds white padding around image to improve PaddleOCR rec-only performance.
        """
        if image is None or image.size == 0:
            return []

        # PaddleOCR rec works better with padding around the text
        h, w = image.shape[:2]
        pad_y = max(8, h // 4)
        pad_x = max(12, w // 6)
        if len(image.shape) == 3:
            padded = cv2.copyMakeBorder(
                image, pad_y, pad_y, pad_x, pad_x,
                cv2.BORDER_CONSTANT, value=(255, 255, 255)
            )
        else:
            padded = cv2.copyMakeBorder(
                image, pad_y, pad_y, pad_x, pad_x,
                cv2.BORDER_CONSTANT, value=255
            )

        try:
            result = self.ocr.ocr(padded, det=False, rec=True, cls=self.use_angle_cls)
        except TypeError:
            return self.read_text(image)

        texts = []
        if not result:
            return texts

        for group in result:
            if group is None:
                continue
            if isinstance(group, (list, tuple)):
                # Direct (text, conf) pair
                if len(group) == 2 and isinstance(group[0], str):
                    texts.append((group[0], float(group[1])))
                    continue
                # List of (text, conf) pairs
                for item in group:
                    if isinstance(item, (list, tuple)) and len(item) >= 2:
                        if isinstance(item[0], str):
                            texts.append((str(item[0]), float(item[1])))

        return texts

    def read_text_cells(self, image, num_cells: int = 5):
        """
        Split the image horizontally into `num_cells` equal cells and OCR each one.
        Designed for mechanical meter digit counters where each digit sits in
        its own window. Returns list of (digit_text, confidence) tuples.
        """
        if image is None or image.size == 0:
            return []

        h, w = image.shape[:2]
        if w < num_cells * 4:
            return []

        cell_w = w / num_cells
        results = []

        for i in range(num_cells):
            x1 = int(i * cell_w)
            x2 = int((i + 1) * cell_w)
            cell = image[:, x1:x2]

            if cell.size == 0:
                continue

            # Pad cell generously for single-digit recognition
            ch, cw = cell.shape[:2]
            pad_y = max(8, ch // 3)
            pad_x = max(8, cw // 2)
            if len(cell.shape) == 3:
                padded = cv2.copyMakeBorder(
                    cell, pad_y, pad_y, pad_x, pad_x,
                    cv2.BORDER_CONSTANT, value=(255, 255, 255)
                )
            else:
                padded = cv2.copyMakeBorder(
                    cell, pad_y, pad_y, pad_x, pad_x,
                    cv2.BORDER_CONSTANT, value=255
                )

            # Resize to reasonable size for OCR
            padded = cv2.resize(padded, (64, 64), interpolation=cv2.INTER_CUBIC)

            try:
                result = self.ocr.ocr(padded, det=False, rec=True, cls=self.use_angle_cls)
            except TypeError:
                continue

            if not result:
                continue

            for group in result:
                if group is None:
                    continue
                if isinstance(group, (list, tuple)):
                    if len(group) == 2 and isinstance(group[0], str):
                        results.append((group[0], float(group[1])))
                        break
                    for item in group:
                        if isinstance(item, (list, tuple)) and len(item) >= 2 and isinstance(item[0], str):
                            results.append((str(item[0]), float(item[1])))
                            break
                    break

        return results


    def _flatten(result) -> Iterable:
        if isinstance(result, list):
            return result
        return [result]


    def _extract_text(item) -> str | None:
        # v3: dict-style results
        if isinstance(item, dict):
            for key in ("text", "rec_text", "text_rec", "rec"):
                val = item.get(key)
                if isinstance(val, str):
                    return val
                if isinstance(val, (list, tuple)) and val and isinstance(val[0], str):
                    return val[0]
            return None
        # v3: object-style results
        for attr in ("text", "rec_text", "text_rec"):
            if hasattr(item, attr):
                val = getattr(item, attr)
                if isinstance(val, str):
                    return val
        # v2: list/tuple results
        if isinstance(item, (list, tuple)) and item:
            if isinstance(item[0], str):
                return item[0]
            if len(item) > 1 and isinstance(item[1], (list, tuple)) and item[1]:
                if isinstance(item[1][0], str):
                    return item[1][0]
        return None
