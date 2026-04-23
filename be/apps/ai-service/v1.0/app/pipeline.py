from __future__ import annotations

from typing import Dict, List
import os
import re

import cv2

from config.settings import Settings
from detector.yolo_detector import YOLODetector
from ocr.paddle_engine import OCREngine


# Các label YOLO dùng để nhận diện vùng đồng hồ tổng
METER_LABELS = {"meter", "Meter_region"}

# Những vùng cần OCR trực tiếp để lấy text/số
TEXT_WINDOW_LABELS = {"Current_pointer_reading_region", "Serial_number_region"}


def _boxes_overlap(box1, box2):
  """
  Kiểm tra 2 bounding box có chồng lấn nhau hay không.
  box có dạng: [x1, y1, x2, y2]

  Ý nghĩa:
  - Dùng để kiểm tra vùng reading/serial có nằm trong vùng meter hay không
  - Nếu không overlap meter_box thì có thể bỏ qua vì không thuộc đồng hồ chính
  """
  x1a, y1a, x2a, y2a = box1
  x1b, y1b, x2b, y2b = box2
  return not (x2a < x1b or x2b < x1a or y2a < y1b or y2b < y1a)


def _normalize_ocr_text(text: str) -> str:
  """
  Chuẩn hóa text OCR để giảm lỗi nhận diện ký tự:
  - O -> 0
  - S -> 5
  - B -> 8

  Ví dụ:
  'O12S' -> '0125'
  """
  text = text.upper()
  text = text.replace("O", "0")
  text = text.replace("S", "5")
  text = text.replace("B", "8")
  return text


def _extract_numbers(text: str) -> str:
  """
  Lấy ra chỉ các chữ số từ text sau khi đã normalize OCR.

  Ví dụ:
  'O1B-S' -> normalize -> '018-5' -> extract -> '0185'
  """
  return "".join(re.findall(r"\d", _normalize_ocr_text(text)))


def _expected_digit_range(label: str) -> tuple[int, int]:
  """
  Quy định độ dài số kỳ vọng theo từng loại vùng OCR.

  - Serial_number_region: thường kỳ vọng 6-10 chữ số
  - Current_pointer_reading_region: thường kỳ vọng 5-8 chữ số
  - Label khác: nới rộng mặc định
  """
  if label == "Serial_number_region":
    return 6, 10
  if label == "Current_pointer_reading_region":
    return 5, 8
  return 1, 64


def _select_numeric_joined(label: str, texts) -> str:
  """
  Chọn kết quả số cuối cùng từ các dòng OCR.

  texts có dạng:
  [
      ("00123", 0.91),
      ("45", 0.72),
      ...
  ]

  Ý tưởng:
  1. Ưu tiên các candidate đã đủ dài và có conf tốt
  2. Nếu chưa có candidate hoàn chỉnh, thử ghép nhiều fragment nhỏ lại
  """
  if not texts:
    return ""

  min_len, max_len = _expected_digit_range(label)
  full_candidates = []
  fragments = []

  for raw_text, conf in texts:
    digits = _extract_numbers(raw_text)
    if not digits:
      continue

    # Nếu candidate đã có số lượng digit hợp lệ và OCR conf đủ tốt
    # thì coi như một ứng viên hoàn chỉnh
    if min_len <= len(digits) <= max_len and conf >= 0.6:
      # Score ưu tiên:
      # - conf cao
      # - chuỗi dài hợp lý
      score = conf + (len(digits) * 0.1)
      full_candidates.append((score, digits))

    # Nếu chưa đủ thành candidate hoàn chỉnh,
    # vẫn giữ lại các mảnh số để ghép lại sau
    if conf >= 0.65 or len(digits) >= 3:
      fragments.append(digits)

  # Nếu đã có candidate đầy đủ thì lấy candidate tốt nhất
  if full_candidates:
    full_candidates.sort(key=lambda item: item[0], reverse=True)
    return full_candidates[0][1]

  # Nếu chưa có candidate hoàn chỉnh, thử nối các fragment lại
  merged = "".join(fragments)
  if merged:
    # Nếu chuỗi ghép không quá dài thì giữ nguyên
    if len(merged) <= max_len + 2:
      return merged
    # Nếu quá dài thì lấy fragment dài nhất
    return max(fragments, key=len)

  return ""


def _score_text_variant(label: str, texts) -> float:
  """
  Chấm điểm cho mỗi biến thể ảnh OCR (ảnh gốc, grayscale, xoay ảnh...)

  Mục tiêu:
  - Chọn ra biến thể ảnh cho OCR kết quả tốt nhất
  """
  if not texts:
    return -1.0

  joined = _select_numeric_joined(label, texts)
  score = get_ocr_conf(texts)

  # Kiểm tra có chứa chữ cái không
  # Vì reading/serial ở đây đang ưu tiên số,
  # nên nếu còn chữ cái thì bị trừ điểm
  has_alpha = any(re.search(r"[A-Z]", _normalize_ocr_text(text)) for text, _ in texts)

  min_len, max_len = _expected_digit_range(label)

  if joined:
    # Nếu độ dài chuỗi số đúng kỳ vọng -> cộng mạnh
    if min_len <= len(joined) <= max_len:
      score += 1.0
    else:
      # Nếu chưa đúng chuẩn thì cộng nhẹ theo độ dài
      score += min(len(joined), max_len) * 0.05

  # Có chữ cái -> giảm độ tin cậy
  if has_alpha:
    score -= 0.25

  return score


def get_ocr_conf(texts):
  """
  Lấy OCR confidence của kết quả OCR.
  Ở đây đang dùng cách đơn giản:
  -> lấy confidence lớn nhất trong các dòng OCR
  """
  if not texts:
    return 0.0
  return max(conf for _, conf in texts)


def get_heuristic_score(label, texts, joined, box, meter_box):
  """
  Chấm điểm heuristic = luật bổ sung ngoài YOLO và OCR.

  Ý tưởng:
  - Nếu text trông hợp lý hơn thì cộng điểm
  - Nếu box nằm trong meter_box thì cộng điểm
  - Nếu OCR ít dòng nhiễu thì cộng điểm

  Tổng heuristic tối đa trong code này là 1.0
  """
  score = 0.0

  # Điều kiện 1:
  # Nếu không có chữ cái -> ưu tiên hơn vì reading/serial đang mong chờ số
  has_alpha = any(re.search(r"[A-Z]", _normalize_ocr_text(text)) for text, _ in texts)
  if not has_alpha:
    score += 0.25

  # Điều kiện 2:
  # Kiểm tra độ dài số có khớp pattern kỳ vọng không
  if label == "Serial_number_region":
    if re.fullmatch(r"\d{6,10}", joined):
      score += 0.25
  elif label == "Current_pointer_reading_region":
    if re.fullmatch(r"\d{5,8}", joined):
      score += 0.25

  # Điều kiện 3:
  # Nếu box hiện tại overlap với meter_box thì cộng điểm
  # -> nghĩa là detection này nằm trong vùng đồng hồ chính
  if meter_box and _boxes_overlap(box, meter_box):
    score += 0.25

  # Điều kiện 4:
  # Nếu số dòng OCR có confidence cao > 0.8 mà ít (<=2 dòng)
  # -> xem như ảnh gọn, ít nhiễu, dễ tin hơn
  valid_texts = [text for text, conf in texts if conf > 0.8]
  if len(valid_texts) <= 2:
    score += 0.25

  return score


class OCRPipeline:
  def __init__(self, settings: Settings | None = None):
    """
    Khởi tạo pipeline:
    - settings: chứa cấu hình model, threshold, device...
    - detector: YOLO detector
    - ocr: OCR engine
    """
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
    """
    Xử lý nhiều ảnh cùng lúc.
    Mỗi ảnh sẽ gọi lại hàm process(image).
    """
    return [self.process(image) for image in images]

  def _read_text_with_variants(self, label: str, crop):
    """
    OCR với nhiều biến thể ảnh khác nhau để chọn ra kết quả tốt nhất.

    Các biến thể hiện tại:
    - ảnh gốc
    - grayscale
    - nếu ảnh cao hơn rộng nhiều thì thử xoay 90 độ
    """
    variants = [crop]

    if label in TEXT_WINDOW_LABELS:
      # Thêm biến thể grayscale
      gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
      variants.append(cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR))

      # Nếu ảnh dạng dọc -> thử xoay để OCR dễ đọc hơn
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

    # OCR từng biến thể ảnh và giữ lại biến thể có score cao nhất
    for variant in variants:
      texts = self.ocr.read_text(variant)
      score = _score_text_variant(label, texts)
      if score > best_score:
        best_crop = variant
        best_texts = texts
        best_score = score

    return best_crop, best_texts

  def process(self, image) -> List[Dict[str, object]]:
    """
    Hàm chính xử lý 1 ảnh:
    1. YOLO detect các vùng
    2. Chọn meter_box lớn nhất
    3. OCR từng vùng text
    4. Tính yolo_conf, ocr_conf, heuristic, final_conf
    5. Trả kết quả
    """
    detections = self.detector.detect(image)

    # Sắp xếp detection theo diện tích giảm dần
    # -> giúp ưu tiên xử lý vùng lớn trước
    detections = sorted(
      detections,
      key=lambda detection: (
        (detection["box"][2] - detection["box"][0])
        * (detection["box"][3] - detection["box"][1])
      ),
      reverse=True,
    )

    # Tìm meter_box lớn nhất
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
      conf = detection["conf"]   # confidence từ YOLO
      label = detection["label"]

      # Nếu là meter_box thì lưu lại như 1 result riêng
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

      # Nếu có meter_box mà box hiện tại không nằm chồng trong meter_box
      # thì bỏ qua
      if meter_box and not _boxes_overlap(box, meter_box):
        continue

      x1, y1, x2, y2 = box
      width = x2 - x1
      height = y2 - y1

      # Bỏ qua box quá nhỏ
      if width < self.settings.crop_min_width or height < self.settings.crop_min_height:
        continue

      image_height, image_width = image.shape[:2]

      # Bỏ qua box quá lớn bất thường (chiếm hơn nửa ảnh)
      if (width * height) > 0.5 * image_width * image_height:
        continue

      # Pad vùng crop:
      # - vùng text thì pad nhỏ để tránh lấy thừa
      # - vùng khác thì pad lớn hơn
      if label in TEXT_WINDOW_LABELS:
        pad = max(2, min(4, int(min(width, height) * 0.03)))
      else:
        pad = 10

      x1 = max(x1 - pad, 0)
      y1 = max(y1 - pad, 0)
      x2 = min(image.shape[1], x2 + pad)
      y2 = min(image.shape[0], y2 + pad)

      # Crop vùng ảnh cần OCR
      crop = image[y1:y2, x1:x2]

      # Phóng to ảnh 2 lần để OCR dễ đọc hơn
      crop = cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

      # OCR với nhiều biến thể và lấy kết quả tốt nhất
      crop, texts = self._read_text_with_variants(label, crop)

      # Lưu crop để debug
      debug_dir = "debug_crops"
      os.makedirs(debug_dir, exist_ok=True)
      crop_path = os.path.join(debug_dir, f"{label}_{conf:.2f}.jpg")
      cv2.imwrite(crop_path, crop)
      print(f"Saved crop to {crop_path} (size: {width}x{height})")

      joined = ""
      if texts:
        if label in TEXT_WINDOW_LABELS:
          # Với reading/serial: ghép số từ OCR texts
          joined = _select_numeric_joined(label, texts)
        else:
          # Với label khác: chỉ lấy các text conf cao
          filtered_texts = [text for text, text_conf in texts if text_conf > 0.8]
          joined = " ".join(filtered_texts)

      # Với serial thì ép lại chỉ giữ số
      if label == "Serial_number_region":
        joined = _extract_numbers(joined)

      print(f"Detected {label} with conf {conf}: '{joined}'")

      # OCR confidence
      ocr_conf = get_ocr_conf(texts)

      # Heuristic confidence
      heuristic = get_heuristic_score(
        label=label,
        texts=texts,
        joined=joined,
        box=box,
        meter_box=meter_box,
      )

      # Final confidence:
      # 45% YOLO + 45% OCR + 10% heuristic
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
