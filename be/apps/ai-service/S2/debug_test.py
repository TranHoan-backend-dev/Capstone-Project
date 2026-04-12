"""Debug specific images to see full API response."""
import requests
import re
import os
import json

TEST_IMAGES = [
    'id_648_value_103_644_jpg.rf.22e268e3902c3e9919f0628dac04fb6f.jpg',  # GT=103, AI=35251
    'id_1062_value_219_494_jpg.rf.8dabd2cac39f5cd0f42d93345a918dd4.jpg',  # GT=219, AI=56219
    'id_1007_value_60_219_jpg.rf.491c5fcddbdac5879a6b0aa60d824e89.jpg',  # GT=60, AI empty
    'id_883_value_67_233_jpg.rf.8b07fae2af9727d7775f9670c4a6ac8b.jpg',  # GT=67, AI=6723
    'id_1031_value_199_337_jpg.rf.91963ba0df60fd1124ce0131aea6aa8f.jpg',  # GT=199, AI=19
    'id_106_value_758_407_jpg.rf.050b71993088d4964959cb3bdd02539c.jpg',  # GT=758, AI=75
]

BASE_DIR = r'c:\Users\Admin\Downloads\deadlineHaiDangPham\test\images'

for img_name in TEST_IMAGES:
    img_path = os.path.join(BASE_DIR, img_name)
    if not os.path.exists(img_path):
        print(f'NOT FOUND: {img_name}')
        continue
    
    with open(img_path, 'rb') as f:
        resp = requests.post('http://127.0.0.1:8000/predict', files={'file': f})
    
    if resp.status_code != 200:
        print(f'ERROR {resp.status_code} for {img_name}')
        continue
    
    data = resp.json()
    gt_m = re.search(r'value_(\d+)_(\d+)_jpg', img_name)
    gt = gt_m.group(1) if gt_m else '?'
    
    print(f'\n{"="*60}')
    print(f'Image: {img_name}')
    print(f'GT: {gt}')
    for det in data.get('results', []):
        label = det.get('label', '')
        text = det.get('text', '')
        yolo_conf = det.get('yolo_conf', 0)
        ocr_conf = det.get('ocr_conf', 0)
        raw = det.get('raw_texts', [])
        box = det.get('box', [])
        print(f'  {label}: text="{text}" yolo_conf={yolo_conf} ocr_conf={ocr_conf}')
        print(f'    box={box}')
        if raw:
            for r in raw[:5]:
                print(f'    raw: "{r[0]}" conf={r[1]}')
    print()
