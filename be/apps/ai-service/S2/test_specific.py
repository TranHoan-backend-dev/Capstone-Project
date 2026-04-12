"""Test specific images to debug wider crop behavior."""
import requests, sys, os, glob

# The 6 images with 2-digit orig where wider crop matters
targets = {
    "id_1149_value_49_279": "49",   # correct 2-digit, wide=498 (bad)
    "id_1244_value_36_984": "36",   # correct 2-digit, wide=336 (bad)
    "id_645_value_31_559": "31",    # correct 2-digit, wide=318 (bad)
    "id_438_value_293_369": "293",  # truncated 2-digit→29, wide=293 (good)
    "id_483_value_554_559": "554",  # truncated 2-digit→55, wide=554 (good)
    "id_86_value_240_729": "240",   # truncated 2-digit→24, wide=240 (good)
}

test_dir = r"c:\Users\Admin\Downloads\deadlineHaiDangPham\test\images"
api_url = "http://127.0.0.1:8000/predict"

for prefix, gt in targets.items():
    # Find the image file
    matches = glob.glob(os.path.join(test_dir, f"{prefix}*"))
    if not matches:
        print(f"NOT FOUND: {prefix}")
        continue
    img_path = matches[0]
    print(f"\n{'='*60}")
    print(f"Image: {os.path.basename(img_path)}")
    print(f"GT: {gt}")
    
    with open(img_path, 'rb') as f:
        resp = requests.post(api_url, files={"file": (os.path.basename(img_path), f, "image/jpeg")})
    
    data = resp.json()
    reading = data.get("meter_reading", {})
    ai = reading.get("value", "")
    conf = reading.get("confidence", 0)
    print(f"AI: {ai} (conf={conf:.3f})")
    print(f"Result: {'CORRECT' if str(ai) == gt else 'WRONG'}")
