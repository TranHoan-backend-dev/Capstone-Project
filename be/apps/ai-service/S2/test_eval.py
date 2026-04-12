"""
Evaluate the improved OCR pipeline on test images.
Ground truth is extracted from filenames: id_{id}_value_{integer}_{decimal}_jpg.rf.{hash}.jpg
The reading (integer part) is the ground truth.
"""
import os
import re
import csv
import sys
import time
import requests

API_URL = "http://127.0.0.1:8000/predict"
TEST_DIR = r"c:\Users\Admin\Downloads\deadlineHaiDangPham\test\images"
OUTPUT_CSV = os.path.join(os.path.dirname(__file__), "test_eval_results.csv")

FILENAME_PATTERN = re.compile(r"id_(\d+)_value_(\d+)_(\d+)_jpg")

def extract_gt(filename):
    m = FILENAME_PATTERN.search(filename)
    if not m:
        return None, None
    img_id = m.group(1)
    gt_reading = m.group(2)
    return img_id, gt_reading

def get_reading_from_response(resp_json):
    results = resp_json.get("results", [])
    best_text = ""
    best_conf = -1.0
    for r in results:
        if r.get("label") == "Current_pointer_reading_region":
            text = (r.get("text") or "").strip()
            conf = r.get("final_conf", 0) or 0
            if text and conf > best_conf:
                best_text = text
                best_conf = conf
    # Fallback: if no confident reading, return first non-empty
    if not best_text:
        for r in results:
            if r.get("label") == "Current_pointer_reading_region":
                text = (r.get("text") or "").strip()
                if text:
                    return text
    return best_text

def main():
    images = sorted([
        f for f in os.listdir(TEST_DIR)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ])
    total = len(images)
    correct = 0
    wrong = 0
    empty_ai = 0
    errors = []
    rows = []

    print(f"Testing {total} images from {TEST_DIR}")
    print(f"API: {API_URL}")
    print("-" * 60)

    start_time = time.time()
    for i, fname in enumerate(images):
        img_id, gt = extract_gt(fname)
        if gt is None:
            print(f"[SKIP] Cannot parse GT from: {fname}")
            continue

        fpath = os.path.join(TEST_DIR, fname)
        try:
            with open(fpath, "rb") as f:
                resp = requests.post(API_URL, files={"file": (fname, f, "image/jpeg")}, timeout=60)
            resp.raise_for_status()
            data = resp.json()
            ai_reading = get_reading_from_response(data)
        except Exception as e:
            ai_reading = ""
            print(f"[ERROR] {fname}: {e}")

        # Normalize: strip leading zeros for comparison
        gt_norm = gt.lstrip("0") or "0"
        ai_norm = ai_reading.lstrip("0") or "0"

        is_correct = (gt_norm == ai_norm)
        if is_correct:
            correct += 1
        else:
            wrong += 1
            if not ai_reading:
                empty_ai += 1

        rows.append({
            "image": fname,
            "id": img_id,
            "gt": gt,
            "ai": ai_reading,
            "gt_norm": gt_norm,
            "ai_norm": ai_norm,
            "result": "Correct" if is_correct else "Wrong"
        })

        if (i + 1) % 10 == 0 or (i + 1) == total:
            elapsed = time.time() - start_time
            acc = correct / (i + 1) * 100
            print(f"[{i+1}/{total}] Correct={correct} Wrong={wrong} Accuracy={acc:.1f}% ({elapsed:.0f}s)")

    # Write CSV
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["image", "id", "gt", "ai", "gt_norm", "ai_norm", "result"])
        w.writeheader()
        w.writerows(rows)

    elapsed = time.time() - start_time
    tested = len(rows)
    acc = correct / tested * 100 if tested else 0

    print("\n" + "=" * 60)
    print(f"RESULTS: {correct}/{tested} correct ({acc:.1f}%)")
    print(f"  Wrong: {wrong} (Empty AI: {empty_ai})")
    print(f"  Time: {elapsed:.0f}s")
    print(f"  CSV: {OUTPUT_CSV}")

    # Error analysis
    wrong_rows = [r for r in rows if r["result"] == "Wrong"]
    if wrong_rows:
        # Categorize
        gt_in_ai = sum(1 for r in wrong_rows if r["gt_norm"] in r["ai_norm"] and r["ai_norm"])
        ai_empty = sum(1 for r in wrong_rows if not r["ai_norm"] or r["ai_norm"] == "0")
        ai_too_long = sum(1 for r in wrong_rows if len(r["ai_norm"]) > len(r["gt_norm"]) * 2 and r["ai_norm"])
        print(f"\n  Error breakdown:")
        print(f"    AI empty/zero: {ai_empty}")
        print(f"    GT inside AI (decimal leak): {gt_in_ai}")
        print(f"    AI too long (>2x GT): {ai_too_long}")

if __name__ == "__main__":
    main()
