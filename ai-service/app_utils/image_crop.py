from __future__ import annotations

from typing import List, Tuple


def crop_regions(
    image,
    boxes: List[Tuple[int, int, int, int]],
    min_size: Tuple[int, int] = (8, 8),
):
    h, w = image.shape[:2]
    min_w, min_h = min_size

    crops = []
    for (x1, y1, x2, y2) in boxes:
        x1 = max(0, min(int(x1), w - 1))
        y1 = max(0, min(int(y1), h - 1))
        x2 = max(0, min(int(x2), w))
        y2 = max(0, min(int(y2), h))

        if x2 <= x1 or y2 <= y1:
            continue
        if (x2 - x1) < min_w or (y2 - y1) < min_h:
            continue

        crop = image[y1:y2, x1:x2]
        crops.append((crop, (x1, y1, x2, y2)))

    return crops
