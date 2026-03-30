from __future__ import annotations

from cProfile import label
from typing import Dict, List
import re
import cv2
import os

from config.settings import Settings
from detector.yolo_detector import YOLODetector
from ocr.paddle_engine import OCREngine
from ocr.text_postprocess import join_texts
from app_utils.image_crop import crop_regions


def _boxes_overlap(box1, box2):
    x1a, y1a, x2a, y2a = box1
    x1b, y1b, x2b, y2b = box2
    return not (x2a < x1b or x2b < x1a or y2a < y1b or y2b < y1a)


def _extract_numbers(text: str) -> str:
    # Normalize common OCR mistakes
    text = text.upper()
    text = text.replace('O', '0')
    text = text.replace('S', '5')
    text = text.replace('B', '8')

    # Extract digits only
    numbers = ''.join(re.findall(r'\d', text))

    # Extract only digits
    return numbers


def get_ocr_conf(texts):
    if not texts:
        return 0.0
    return max([conf for _, conf in texts])

def get_heuristic_score(label, texts, joined, box, meter_box):
    score = 0.0

    # 1. Có chữ hay không (đối với reading thì không cần chữ, nhưng đối với serial number thì nên có chữ để tăng độ tin cậy, nếu toàn số thì có thể là nhầm với reading) -> nếu có chữ thì tăng điểm
    has_alpha = any(re.search(r'[A-Z]', t.upper()) for t, _ in texts)
    if not has_alpha:
        score += 0.25

    # 2. Nếu serial number mà có toàn số và độ dài hợp lý (8-10) thì tăng điểm, nếu reading mà có toàn số và độ dài hợp lý (5-8) thì tăng điểm, nếu có chữ thì giảm điểm (có thể nhầm với serial number) -> nếu có chữ thì giảm điểm, nếu có toàn số và độ dài hợp lý thì tăng điểm
    if label == "Serial_number_region":
        if re.fullmatch(r'\d{8,10}', joined):
            score += 0.25
    elif label == "Current_pointer_reading_region":
        if re.fullmatch(r'\d{5,8}', joined):
            score += 0.25

    # 3. Crop vùng đugs
    if meter_box:
        if _boxes_overlap(box, meter_box):
            score += 0.25

    # 4. Số lượng text thô OCR ra được (nếu quá nhiều text thì có thể là sai) -> nếu chỉ OCR ra được 1-2 text có độ tin cậy cao thì tăng điểm, nếu nhiều hơn thì giảm điểm
    valid_texts = [t for t, conf in texts if conf > 0.8]
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
        )

        self.ocr = OCREngine(
            lang=self.settings.ocr_lang,
            use_angle_cls=self.settings.ocr_use_angle_cls,
            use_det=self.settings.ocr_use_det,
        )

    def process(self, image) -> List[Dict[str, object]]:
        detections = self.detector.detect(image)

        detections = sorted(
            detections,
            key=lambda d: (d["box"][2] - d["box"][0]) * (d["box"][3] - d["box"][1]),
            reverse=True
        )

        # Find meter: class 0 with largest area
        meter_box = None
        max_area = 0
        for det in detections:
            if det['label'] == "meter":
                x1, y1, x2, y2 = det['box']
                area = (x2 - x1) * (y2 - y1)
                if area > max_area:
                    max_area = area
                    meter_box = det['box']

        results: List[Dict[str, object]] = []

        for detection in detections:
            box = detection['box']
            cls = detection['class']
            conf = detection['conf']
            label = detection['label']

            if label == "Meter_region":
                # Meter, no OCR
                results.append({
                    "box": box,
                    "label": "meter",
                    "text": "",
                    "conf": conf,
                    "raw_texts": [], #raw_texts lÃ  Ä‘á»ƒ lÆ°u káº¿t quáº£ OCR thÃ´, nhÆ°ng vá»›i meter thÃ¬ khÃ´ng cáº§n nÃªn Ä‘á»ƒ trá»‘ng
                })
                continue

            # Check if overlaps with meter
            if meter_box and not _boxes_overlap(box, meter_box):
                continue

            x1, y1, x2, y2 = box
            w = x2 - x1
            h = y2 - y1
            if w < self.settings.crop_min_width or h < self.settings.crop_min_height:
                continue

            img_h, img_w = image.shape[:2]

            # âŒ bá» box quÃ¡ to (trÃ¡nh láº¥y cáº£ Ä‘á»“ng há»“)
            if (w * h) > 0.5 * img_w * img_h:
                continue

            


            # thÃªm padding cho crop
            pad = 10 # pad lÃ  sá»‘ pixel thÃªm vÃ o má»—i bÃªn cá»§a box Ä‘á»ƒ trÃ¡nh cáº¯t sÃ¡t quÃ¡, cÃ³ thá»ƒ Ä‘iá»u chá»‰nh náº¿u cáº§n
            x1 = max(x1 - pad, 0)
            y1 = max(y1 - pad, 0)
            x2 = min(image.shape[1], x2 + pad)
            y2 = min(image.shape[0], y2 + pad)

            crop = image[y1:y2, x1:x2] 

            # resize for OCR
            crop = cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            if label == "reading":
                _, gray = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)

            crop = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
            
            # Debug: Save crop for inspection
            debug_dir = "debug_crops"
            os.makedirs(debug_dir, exist_ok=True)
            crop_path = os.path.join(debug_dir, f"{label}_{conf:.2f}.jpg")
            cv2.imwrite(crop_path, crop)
            print(f"Saved crop to {crop_path} (size: {w}x{h})")

            texts = self.ocr.read_text(crop)

            joined = ""
            if texts:
                if label == "Current_pointer_reading_region":
                    filtered_texts = []
                    for t, ocr_conf in texts:
                        if ocr_conf > 0.8:
                            # âŒ bá» náº¿u cÃ³ chá»¯
                            if re.search(r'[A-Z]', t.upper()):
                                continue
                            filtered_texts.append(t)

                    joined = " ".join(filtered_texts)

                elif label == "Serial_number_region":
                    filtered_texts = []
                    for t, ocr_conf in texts:
                        if ocr_conf > 0.8:
                            # âœ… chá»‰ giá»¯ náº¿u toÃ n sá»‘ (khÃ´ng chá»¯, khÃ´ng kÃ½ tá»± Ä‘áº·c biá»‡t)
                            if re.fullmatch(r'\d+', t):
                                filtered_texts.append(t)

                    joined = " ".join(filtered_texts)

                else:
                    filtered_texts = [t[0] for t in texts if t[1] > 0.8]
                    joined = " ".join(filtered_texts)

            
            
            if label in ["Serial_number_region"]: # reading
                joined = _extract_numbers(joined)
                

            print(f"Detected {label} with conf {conf}: '{joined}'")

            ocr_conf = get_ocr_conf(texts)

            heuristic = get_heuristic_score(
                label=label,
                texts=texts,
                joined=joined,
                box=box,
                meter_box=meter_box
            )

            final_conf = (
                conf * 0.45 +
                ocr_conf * 0.45 +
                heuristic * 0.10
            )

            # clamp vá» [0,1]
            final_conf = max(0, min(1, final_conf))

            results.append({
                "box": box,
                "label": label,
                "text": joined,
                
                "yolo_conf": conf,                 # YOLO
                "ocr_conf": round(ocr_conf, 3),
                "heuristic": round(heuristic, 3),
                "final_conf": round(final_conf, 3),

                "raw_texts": texts,
            })

        return results
