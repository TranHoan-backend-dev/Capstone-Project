from __future__ import annotations

from typing import Dict, List
import os
import re

import cv2
import numpy as np

from config.settings import Settings
from detector.yolo_detector import YOLODetector
from ocr.paddle_engine import OCREngine


# Các label YOLO dùng trong pipeline
METER_LABELS = {"meter", "Meter_region"}                     # vùng đồng hồ tổng
READING_LABEL = "Current_pointer_reading_region"            # vùng số chính
DECIMAL_LABEL = "Current_pointer_decimal_region"            # vùng số thập phân / số đỏ
SERIAL_LABEL = "Serial_number_region"                       # vùng serial
TEXT_WINDOW_LABELS = {READING_LABEL, SERIAL_LABEL}          # các vùng cần OCR text trực tiếp


def _boxes_overlap(box1, box2):
  """
  Kiểm tra 2 box có giao nhau hay không.

  Dùng để:
  - kiểm tra reading/serial có nằm trong meter_box hay không
  - ghép decimal box với reading box
  """
  x1a, y1a, x2a, y2a = box1
  x1b, y1b, x2b, y2b = box2
  return not (x2a < x1b or x2b < x1a or y2a < y1b or y2b < y1a)


def _intersection_area(box1, box2) -> int:
  """
  Tính diện tích giao nhau giữa 2 box.
  Nếu không giao nhau thì trả về 0.

  Dùng để đánh giá mức độ overlap giữa reading box và decimal box.
  """
  x1 = max(box1[0], box2[0])
  y1 = max(box1[1], box2[1])
  x2 = min(box1[2], box2[2])
  y2 = min(box1[3], box2[3])
  if x2 <= x1 or y2 <= y1:
    return 0
  return (x2 - x1) * (y2 - y1)


def _select_decimal_detection_for_reading(reading_box, decimal_detections):
  """
  Chọn decimal detection phù hợp nhất cho một reading box.

  Ý tưởng:
  - Decimal phải overlap với reading
  - Decimal thường nằm bên phải reading
  - Decimal nào có overlap tốt + conf tốt sẽ được chọn
  """
  rx1, _, rx2, _ = reading_box
  reading_width = max(1, rx2 - rx1)
  reading_center_x = rx1 + (reading_width / 2)

  candidates = []
  for detection in decimal_detections:
    decimal_box = detection["box"]

    # Decimal phải overlap reading
    if not _boxes_overlap(reading_box, decimal_box):
      continue

    # Diện tích giao nhau phải > 0
    intersection = _intersection_area(reading_box, decimal_box)
    if intersection <= 0:
      continue

    dx1, _, dx2, _ = decimal_box
    decimal_center_x = dx1 + ((dx2 - dx1) / 2)

    # Decimal phải nằm về phía bên phải reading
    if decimal_center_x <= reading_center_x and dx1 <= rx1 + int(reading_width * 0.35):
      continue

    # Score = overlap ratio + confidence của decimal detection
    overlap_ratio = intersection / max(1, (dx2 - dx1) * (decimal_box[3] - decimal_box[1]))
    score = overlap_ratio + detection["conf"]
    candidates.append((score, detection))

  if not candidates:
    return None

  # Chọn decimal detection có score cao nhất
  candidates.sort(key=lambda item: item[0], reverse=True)
  return candidates[0][1]


def _crop_reading_before_decimal(image, reading_box, decimal_detection, pad: int):
  """
  Crop vùng reading và cắt bỏ phần decimal ở bên phải nếu có.

  Mục tiêu:
  - chỉ giữ phần integer
  - tránh OCR đọc lẫn cả số đỏ / phần thập phân
  """
  x1, y1, x2, y2 = reading_box
  x1 = max(x1 - pad, 0)
  y1 = max(y1 - pad, 0)
  x2 = min(image.shape[1], x2 + pad)
  y2 = min(image.shape[0], y2 + pad)

  # Nếu có decimal detection thì cắt phần phải trước decimal
  if decimal_detection is not None:
    decimal_x1 = decimal_detection["box"][0]
    cut_margin = max(2, pad)
    x2 = min(x2, max(x1 + 1, decimal_x1 - cut_margin))

  return image[y1:y2, x1:x2]


def _effective_reading_yolo_conf(reading_conf: float, decimal_detection) -> float:
  """
  Tính confidence YOLO hiệu dụng cho reading.

  Vì crop reading cuối cùng phụ thuộc cả:
  - reading box
  - decimal box

  nên nếu có decimal_detection:
  final reading yolo conf = 50% reading_conf + 50% decimal_conf
  """
  if decimal_detection is None:
    return reading_conf

  decimal_conf = decimal_detection["conf"]
  return (max(0.0, reading_conf) * 0.5) + (max(0.0, decimal_conf) * 0.5)


def _normalize_numeric_text(text: str) -> str:
  """
  Chuẩn hóa text OCR cho các field số.

  Các lỗi OCR phổ biến:
  O -> 0
  I -> 1
  L -> 1
  S -> 5
  B -> 8
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
  Serial có thể chứa cả chữ và số,
  nên chỉ giữ lại A-Z và 0-9.
  """
  return re.sub(r"[^A-Z0-9]", "", text.upper())


def _extract_digits(text: str) -> str:
  """
  Chỉ lấy các chữ số từ text.
  """
  return "".join(re.findall(r"\d", text))


def _extract_reading_integer(raw_text: str) -> str:
  """
  Chỉ lấy phần integer của reading.

  Ví dụ:
  - 1234.56 -> 1234
  - 1234,56 -> 1234

  Ngoài ra:
  - loại bỏ ký tự rác
  - với chuỗi 6-8 chữ số bắt đầu bằng 0, chỉ lấy 5 số đầu
    vì đồng hồ nước thường có 5 số nguyên + phần thập phân
  """
  normalized = _normalize_numeric_text(raw_text)
  sanitized = re.sub(r"[^0-9.,\s\-]", "", normalized)
  if not sanitized:
    return ""

  # Nếu có dấu . hoặc , thì chỉ lấy phần trước dấu đó
  if "." in sanitized or "," in sanitized:
    integer_part = re.split(r"[.,]", sanitized, maxsplit=1)[0]
  else:
    integer_part = sanitized

  digits = _extract_digits(integer_part)

  # Nếu OCR đọc cả cụm 6-8 số có leading zero, chỉ lấy 5 số đầu
  if 6 <= len(digits) <= 8 and digits[0] == "0":
    digits = digits[:5]
  elif len(digits) > 6:
    # Cắt an toàn nếu quá dài
    digits = digits[:5]

  return digits


def _is_valid_serial(text: str) -> bool:
  """
  Serial hợp lệ: 5-12 ký tự, gồm chữ và số.
  """
  return bool(re.fullmatch(r"[A-Z0-9]{5,12}", text))


def _is_valid_barcode_serial(text: str) -> bool:
  """
  Barcode-style serial hợp lệ: 5-12 chữ số.
  """
  return bool(re.fullmatch(r"\d{5,12}", text))


def _is_valid_reading(text: str) -> bool:
  """
  Reading hợp lệ: 1-8 chữ số.
  """
  return bool(re.fullmatch(r"\d{1,8}", text))


def _serial_has_barcode_hint(texts) -> bool:
  """
  Kiểm tra vùng serial có dấu hiệu barcode hay không.

  Điều kiện:
  - có dòng OCR numeric-only
  - conf >= 0.5
  - khớp dạng barcode serial
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
  Chọn serial cuối cùng từ OCR texts.

  Luật:
  1. Nếu có barcode hint -> ưu tiên numeric line hợp lệ
  2. Nếu không có barcode -> cố ghép alphanumeric serial đầy đủ
  3. Nếu vẫn chưa tốt -> lấy candidate tốt nhất còn lại
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

  # Nếu có barcode hint -> ưu tiên numeric serial
  if _serial_has_barcode_hint(texts):
    for cleaned, conf in cleaned_lines:
      if conf >= 0.5 and _is_valid_barcode_serial(cleaned):
        return cleaned

    # Nếu không có numeric line hoàn hảo,
    # lấy numeric candidate dài / tốt nhất
    numeric_candidates = [
      (cleaned, conf)
      for cleaned, conf in cleaned_lines
      if _extract_digits(cleaned)
    ]
    if numeric_candidates:
      return max(numeric_candidates, key=lambda item: (len(item[0]), item[1]))[0]

  # Nếu không có barcode hint -> ghép các fragment mạnh
  strong_fragments = [
    cleaned
    for cleaned, conf in cleaned_lines
    if conf >= 0.55
  ]
  merged = _sanitize_serial_text("".join(strong_fragments))
  if _is_valid_serial(merged):
    return merged

  # Nếu chưa ghép được, chọn whole-line candidate hợp lệ tốt nhất
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

  # Nếu mọi thứ đều fail -> lấy dòng tốt nhất còn lại
  return max(cleaned_lines, key=lambda item: (item[1], len(item[0])))[0]


def _select_reading_joined(texts) -> str:
  """
  Chọn reading cuối cùng từ OCR texts.

  Luật:
  - chỉ giữ phần integer
  - không ghép lẫn decimal đỏ
  - ưu tiên reading có độ dài hợp lý
  - nếu OCR tách nhỏ nhiều fragment thì thử ghép lại
  """
  if not texts:
    return ""

  candidates = []
  fallback = []

  for index, (raw_text, conf) in enumerate(texts):
    integer_part = _extract_reading_integer(raw_text)
    if not integer_part:
      continue

    # Bỏ leading zero sớm để chấm độ dài chính xác hơn
    stripped = integer_part.lstrip("0") or "0"

    fallback.append((index, conf, stripped))

    if _is_valid_reading(stripped):
      # Chấm bonus theo độ dài
      # thực tế reading thường hợp lý nhất ở khoảng 1-5 chữ số
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

      # Dòng OCR xuất hiện sớm hơn được ưu tiên hơn
      # vì decimal thường nằm các dòng sau
      score = conf + length_bonus - index * 0.05
      candidates.append((score, stripped))

  # Nếu OCR tách reading thành nhiều mảnh ngắn, thử ghép lại
  if len(fallback) > 1:
    confident_fragments = [
      (idx, conf, digits)
      for idx, conf, digits in fallback
      if conf >= 0.35 and len(digits) <= 3
    ]
    if len(confident_fragments) >= 2:
      confident_fragments.sort(key=lambda x: x[0])
      concatenated = "".join(d for _, _, d in confident_fragments)
      concatenated = concatenated.lstrip("0") or "0"
      avg_conf = sum(c for _, c, _ in confident_fragments) / len(confident_fragments)
      if _is_valid_reading(concatenated) and 2 <= len(concatenated) <= 5:
        # bonus cho multi-fragment ghép hợp lý
        concat_score = avg_conf + 0.3 + 0.15
        candidates.append((concat_score, concatenated))

  if candidates:
    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates[0][1]

  # Fallback: nếu không có candidate tốt,
  # chọn kết quả có độ dài vừa phải hơn
  if fallback:
    fallback.sort(key=lambda item: (
      -(5 - abs(len(item[2]) - 3)),  # ưu tiên kết quả 1-5 digits
      item[0],
      -item[1]
    ))
    return fallback[0][2]

  return ""


def _score_text_variant(label: str, texts) -> float:
  """
  Chấm điểm cho từng biến thể ảnh OCR.

  Mục tiêu:
  - thử nhiều phiên bản crop
  - chọn ra biến thể cho kết quả OCR tốt nhất
  """
  if not texts:
    return -1.0

  score = get_ocr_conf(texts)

  # Nếu là serial -> chấm theo logic serial
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

  # Nếu là reading -> chấm theo logic reading
  if label == READING_LABEL:
    joined = _select_reading_joined(texts)
    if joined:
      if _is_valid_reading(joined):
        length = len(joined)
        if 2 <= length <= 3:
          score += 1.0
        elif length == 4:
          score += 0.8
        elif length == 1:
          score += 0.4
        elif length == 5:
          score += 0.7
        elif length <= 6:
          score += 0.5
        else:
          score += 0.2
      else:
        score += min(len(joined), 8) * 0.05
    return score

  # Label khác -> cộng nhẹ theo text conf cao
  joined = " ".join(text for text, conf in texts if conf > 0.8)
  if joined:
    score += min(len(joined), 20) * 0.02
  return score


def get_ocr_conf(texts):
  """
  OCR confidence = conf lớn nhất trong các dòng OCR.
  """
  if not texts:
    return 0.0
  return max(conf for _, conf in texts)


def get_heuristic_score(label, texts, joined, box, meter_box):
  """
  Heuristic score = luật bổ sung ngoài YOLO và OCR.

  Mỗi điều kiện đúng thường cộng 0.25:
  - có joined hợp lệ
  - format hợp lệ
  - overlap meter_box
  - ít dòng OCR mạnh -> ít nhiễu
  """
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

  # Box nằm trong meter -> đáng tin hơn
  if meter_box and _boxes_overlap(box, meter_box):
    score += 0.25

  # Ít text conf cao -> vùng OCR gọn, ít nhiễu
  valid_texts = [text for text, conf in texts if conf > 0.8]
  if len(valid_texts) <= 2:
    score += 0.25

  return score


def _detect_red_boundary(crop) -> int | None:
  """
  Tìm vị trí bắt đầu của vùng số đỏ trong ảnh crop reading.

  Ý tưởng:
  - chuyển sang HSV
  - tìm vùng đỏ
  - decimal digits thường nằm phía bên phải
  - nếu tìm thấy cột đỏ đầu tiên thì cắt ảnh trước vùng đó
  """
  if crop is None or crop.size == 0 or len(crop.shape) < 3:
    return None

  hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
  h, s, v = cv2.split(hsv)

  # Màu đỏ trong HSV nằm ở 2 đầu dải hue
  mask_low = (h <= 15) & (s >= 80) & (v >= 50)
  mask_high = (h >= 165) & (s >= 80) & (v >= 50)
  red_mask = (mask_low | mask_high).astype(np.float32)

  height, width = crop.shape[:2]
  if width < 20:
    return None

  # Tính độ mạnh màu đỏ theo từng cột
  col_strength = red_mask.mean(axis=0)

  # Chỉ tìm ở phần phải của ảnh vì decimal thường nằm bên phải
  search_start = int(width * 0.35)
  threshold = 0.10

  for x in range(search_start, width):
    if col_strength[x] > threshold:
      return max(0, x - 2)

  return None


class OCRPipeline:
  def __init__(self, settings: Settings | None = None):
    """
    Khởi tạo pipeline:
    - detector: YOLO
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
    """
    return [self.process(image) for image in images]

  def _read_text_with_variants(self, label: str, crop):
    """
    OCR với nhiều biến thể ảnh khác nhau để chọn ra kết quả tốt nhất.

    Các biến thể:
    - ảnh gốc
    - grayscale
    - với reading còn thêm:
      CLAHE, Otsu, bilateral, sharpen
    - nếu crop cao hơn rộng nhiều thì thử xoay 90 độ
    """
    variants = [crop]

    if label in TEXT_WINDOW_LABELS:
      gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
      variants.append(cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR))

      if label == READING_LABEL:
        # CLAHE: tăng tương phản cho ảnh đồng hồ mờ/bẩn
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        variants.append(cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR))

        # Otsu: nhị phân hóa để làm rõ chữ số cơ
        _, otsu = cv2.threshold(
          gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )
        variants.append(cv2.cvtColor(otsu, cv2.COLOR_GRAY2BGR))

        # Bilateral: giảm nhiễu nhưng giữ biên chữ số
        bilateral = cv2.bilateralFilter(crop, 9, 75, 75)
        variants.append(bilateral)

        # Sharpen: làm sắc nét ảnh bị blur
        blurred = cv2.GaussianBlur(gray, (0, 0), 3)
        sharpened = cv2.addWeighted(gray, 1.5, blurred, -0.5, 0)
        variants.append(cv2.cvtColor(sharpened, cv2.COLOR_GRAY2BGR))

      # Nếu ảnh quá dọc thì thử xoay
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

    # OCR từng biến thể và chọn biến thể tốt nhất
    for variant in variants:
      texts = self.ocr.read_text(variant)
      score = _score_text_variant(label, texts)
      if score > best_score:
        best_crop = variant
        best_texts = texts
        best_score = score

    # Riêng reading: thử recognition-only để tránh OCR tách vụn digit
    if label == READING_LABEL:
      det_false_texts = self.ocr.read_text_crop(crop)
      det_false_score = _score_text_variant(label, det_false_texts)
      if det_false_score > best_score:
        best_crop = crop
        best_texts = det_false_texts
        best_score = det_false_score

    return best_crop, best_texts

  def _read_reading_with_cell_split(self, crop, num_cells: int = 5):
    """
    Chia vùng reading thành nhiều ô nhỏ theo chiều ngang,
    OCR từng ô như từng digit riêng.

    Dùng khi:
    - OCR thông thường bị tách digit lỗi
    - reading dài nhưng OCR đọc không ổn
    """
    cell_results = self.ocr.read_text_cells(crop, num_cells=num_cells)
    if not cell_results:
      return []

    digits = []
    confs = []
    for text, conf in cell_results:
      normalized = _normalize_numeric_text(text)
      d = _extract_digits(normalized)
      if d:
        digits.append(d[0])  # chỉ lấy digit đầu tiên mỗi ô
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
    OCR-only cho một crop reading đã được cắt sẵn.

    Không dùng YOLO detection nữa,
    chỉ dùng OCR + postprocess + heuristic.
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

    # Resize thích nghi theo kích thước crop
    h, w = image.shape[:2]
    min_dim = min(h, w)
    if min_dim < 32:
      scale = max(4, 128 // max(min_dim, 1))
    elif min_dim < 64:
      scale = 3
    else:
      scale = 2
    crop = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

    # Nếu thấy vùng đỏ ở bên phải thì cắt bỏ decimal
    red_x = _detect_red_boundary(crop)
    if red_x is not None and red_x > crop.shape[1] * 0.3:
      crop = crop[:, :red_x]

    _, texts = self._read_text_with_variants(READING_LABEL, crop)

    # Nếu OCR thường yếu hoặc ra chuỗi bất thường thì thử cell split
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

    # process_reading_crop không có YOLO box thật,
    # nên dùng box = toàn bộ ảnh crop
    box = [0, 0, image.shape[1], image.shape[0]]
    heuristic = get_heuristic_score(
      label=READING_LABEL,
      texts=texts,
      joined=joined,
      box=box,
      meter_box=None,
    )

    # Vì đây là OCR-only nên final_conf = 80% OCR + 20% heuristic
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
    """
    Hàm chính xử lý toàn ảnh:
    1. YOLO detect tất cả box
    2. Chọn meter_box lớn nhất
    3. Tách decimal cho reading
    4. OCR từng vùng với nhiều fallback
    5. Tính confidence cuối cùng
    """
    detections = self.detector.detect(image)

    # Sắp xếp detection theo diện tích giảm dần
    detections = sorted(
      detections,
      key=lambda detection: (
        (detection["box"][2] - detection["box"][0])
        * (detection["box"][3] - detection["box"][1])
      ),
      reverse=True,
    )

    # Chọn meter_box lớn nhất làm đồng hồ chính
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

    # Tách sẵn danh sách decimal detection
    decimal_detections = [
      detection for detection in detections if detection["label"] == DECIMAL_LABEL
    ]

    for detection in detections:
      box = detection["box"]
      conf = detection["conf"]
      label = detection["label"]

      # Meter box chỉ lưu để tham chiếu
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

      # Nếu detection không nằm trong meter_box thì bỏ
      if meter_box and not _boxes_overlap(box, meter_box):
        continue

      # Decimal box không OCR trực tiếp, chỉ dùng hỗ trợ reading
      if label == DECIMAL_LABEL:
        continue

      x1, y1, x2, y2 = box
      width = x2 - x1
      height = y2 - y1

      # Bỏ box quá nhỏ
      if width < self.settings.crop_min_width or height < self.settings.crop_min_height:
        continue

      image_height, image_width = image.shape[:2]

      # Bỏ box quá lớn bất thường
      if (width * height) > 0.5 * image_width * image_height:
        continue

      # Với reading/serial dùng pad lớn hơn một chút để tránh cắt mất digit
      if label in TEXT_WINDOW_LABELS:
        pad = max(3, min(8, int(min(width, height) * 0.08)))
      else:
        pad = 10

      x1 = max(x1 - pad, 0)
      y1 = max(y1 - pad, 0)
      x2 = min(image.shape[1], x2 + pad)
      y2 = min(image.shape[0], y2 + pad)

      if label == READING_LABEL:
        # Ghép decimal detection tốt nhất với reading box
        decimal_detection = _select_decimal_detection_for_reading(box, decimal_detections)

        # Crop reading nhưng loại bỏ decimal nếu có
        crop = _crop_reading_before_decimal(image, box, decimal_detection, pad)

        # Tính reading yolo conf hiệu dụng
        effective_yolo_conf = _effective_reading_yolo_conf(conf, decimal_detection)

        reading_yolo_conf = conf
        decimal_yolo_conf = decimal_detection["conf"] if decimal_detection is not None else None

        # Nếu YOLO không detect được decimal -> fallback bằng red boundary
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

      # Resize thích nghi để OCR dễ đọc hơn
      crop_h, crop_w = crop.shape[:2]
      min_dim = min(crop_h, crop_w)
      if min_dim < 32:
        scale = max(4, 128 // max(min_dim, 1))
      elif min_dim < 64:
        scale = 3
      else:
        scale = 2
      crop = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

      # OCR với nhiều biến thể ảnh
      crop, texts = self._read_text_with_variants(label, crop)

      # Nếu là reading -> có thêm nhiều fallback OCR
      if label == READING_LABEL:
        main_joined = _select_reading_joined(texts) if texts else ""
        main_score = _score_text_variant(READING_LABEL, texts)

        # Xác định số cell theo tỷ lệ ngang/dọc của crop
        crop_h, crop_w = crop.shape[:2]
        aspect = crop_w / max(crop_h, 1)
        if aspect > 3:
          num_cells = min(8, max(3, round(aspect * 1.2)))
        else:
          num_cells = 5

        # Nếu OCR chính yếu hoặc ra chuỗi bất thường -> thử cell split
        try_cells = (
          main_score < 1.0
          or not main_joined
          or len(main_joined) > 6
        )
        if try_cells:
          cell_texts = self._read_reading_with_cell_split(crop, num_cells=num_cells)
          cell_score = _score_text_variant(READING_LABEL, cell_texts)
          cell_joined = _select_reading_joined(cell_texts) if cell_texts else ""

          if cell_joined and cell_score > main_score:
            texts = cell_texts
          elif cell_joined and not main_joined:
            texts = cell_texts

        # Nếu reading quá ngắn (1-2 digit) -> mở rộng crop ra để OCR lại
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

          # Nếu có decimal detection thì vẫn phải cắt phần decimal
          if decimal_detection is not None:
            dec_x1 = decimal_detection["box"][0]
            wide_x2 = min(wide_x2, max(wide_x1 + 1, dec_x1 - max(2, pad)))

          wide_crop = image[wide_y1:wide_y2, wide_x1:wide_x2]
          if wide_crop.size > 0:
            # Nếu thấy vùng đỏ thì tiếp tục cắt decimal
            wide_red_x = _detect_red_boundary(wide_crop)
            if wide_red_x is not None and wide_red_x > wide_crop.shape[1] * 0.3:
              wide_crop = wide_crop[:, :wide_red_x]

            # Resize wider crop
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

            # Nếu wider crop cho kết quả dài hơn và score đủ cạnh tranh -> dùng wider crop
            score_threshold = curr_score - 0.1
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

      # Lưu crop ra file để debug
      debug_dir = "debug_crops"
      os.makedirs(debug_dir, exist_ok=True)
      crop_path = os.path.join(debug_dir, f"{label}_{conf:.2f}.jpg")
      cv2.imwrite(crop_path, crop)
      print(f"Saved crop to {crop_path} (size: {width}x{height})")

      # Ghép text cuối cùng
      joined = ""
      if texts:
        if label == SERIAL_LABEL:
          joined = _select_serial_joined(texts)
        elif label == READING_LABEL:
          joined = _select_reading_joined(texts)
        else:
          filtered_texts = [text for text, text_conf in texts if text_conf > 0.8]
          joined = "".join(filtered_texts)

      # In log debug
      if label == READING_LABEL:
        print(
          f"Detected {label} with reading_conf={reading_yolo_conf}, "
          f"decimal_conf={decimal_yolo_conf}, yolo_conf={effective_yolo_conf}: '{joined}'"
        )
      else:
        print(f"Detected {label} with conf {conf}: '{joined}'")

      # Tính OCR conf
      ocr_conf = get_ocr_conf(texts)

      # Tính heuristic
      heuristic = get_heuristic_score(
        label=label,
        texts=texts,
        joined=joined,
        box=box,
        meter_box=meter_box,
      )

      # Final confidence:
      # 45% YOLO + 45% OCR + 10% heuristic
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

    # Nếu không detect được reading nhưng có meter_box
    # thì OCR fallback ở vùng giữa-trên của đồng hồ
    has_reading = any(r["label"] == READING_LABEL for r in results)
    if not has_reading and meter_box is not None:
      mx1, my1, mx2, my2 = meter_box
      mw = mx2 - mx1
      mh = my2 - my1

      # Vùng reading thường nằm phần trên-giữa của meter
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

        # Nếu có số đỏ thì cắt bỏ
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

          # Vì fallback này không có reading detection thật,
          # nên gán YOLO conf thấp = 0.2
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

    # Nếu có nhiều reading result -> chỉ giữ reading có final_conf cao nhất
    reading_results = [r for r in results if r["label"] == READING_LABEL and r.get("text")]
    if len(reading_results) > 1:
      best_reading = max(reading_results, key=lambda r: r.get("final_conf", 0))
      results = [r for r in results if r["label"] != READING_LABEL or r is best_reading]

      # Nếu có reading rỗng thì thêm lại
      for r in [r for r in reading_results if not r.get("text")]:
        if r not in results:
          results.append(r)

    return results
