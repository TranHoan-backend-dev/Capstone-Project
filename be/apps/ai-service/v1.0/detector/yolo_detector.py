from __future__ import annotations

from typing import Dict, List, Tuple

from .model_loader import load_yolo


class YOLODetector:
    def __init__(
        self,
        weights_path: str,
        conf: float = 0.25,
        iou: float = 0.45,
        device: str = "",
        img_size: int = 0,
        quantize: bool = False,
    ):
        self.model = load_yolo(weights_path, device, quantize=quantize)
        self.model.conf = conf
        self.model.iou = iou
        self.img_size = img_size


    def detect(self, image) -> List[Dict[str, any]]:
        return self.detect_batch([image])[0]

    def detect_batch(self, images) -> List[List[Dict[str, any]]]:
        if self.img_size and self.img_size > 0:
            results = self.model(images, size=self.img_size)
        else:
            results = self.model(images)

        names = self.model.names  # 🔥 lấy label thật từ YOLO
        batch_detections: List[List[Dict[str, any]]] = []

        for prediction in results.xyxy:
            detections: List[Dict[str, any]] = []
            for *box, conf, cls in prediction.tolist():
                x1, y1, x2, y2 = map(int, box)
                detections.append({
                    'box': (x1, y1, x2, y2),
                    'class': int(cls),
                    'conf': conf,
                    'label': names[int(cls)]  # 🔥 FIX QUAN TRỌNG
                })
            batch_detections.append(detections)

        return batch_detections
