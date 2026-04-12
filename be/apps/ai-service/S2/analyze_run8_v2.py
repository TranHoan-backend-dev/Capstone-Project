"""Analyze Run 8 errors in detail."""
import csv
from collections import Counter

run8_path = r"C:\Users\Admin\Downloads\deadlineHaiDangPham\yolo_paddle_realtime_support_bundle\test_eval_results.csv"

rows = []
with open(run8_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        rows.append(r)

correct = [r for r in rows if r.get('result') == 'Correct']
wrong = [r for r in rows if r.get('result') == 'Wrong']
print(f"Total: {len(rows)}, Correct: {len(correct)}, Wrong: {len(wrong)}")

empty = []
gt_in_ai = []
ai_in_gt = []
one_off = []
wrong_shorter = []
wrong_longer = []
wrong_same = []

for r in wrong:
    gt = r.get('gt_norm', r.get('gt', ''))
    ai = r.get('ai_norm', r.get('ai', ''))
    fn = r.get('image', '')[:55]
    
    if not ai or ai == '0':
        empty.append((fn, gt, ai))
    elif gt in ai and len(ai) > len(gt):
        gt_in_ai.append((fn, gt, ai))
    elif ai in gt and len(ai) < len(gt):
        ai_in_gt.append((fn, gt, ai))
    elif len(gt) > 0 and len(ai) > 0 and len(gt) == len(ai):
        diff = sum(1 for a, b in zip(gt, ai) if a != b)
        if diff == 1:
            one_off.append((fn, gt, ai))
        else:
            wrong_same.append((fn, gt, ai))
    elif len(ai) < len(gt):
        wrong_shorter.append((fn, gt, ai))
    elif len(ai) > len(gt):
        wrong_longer.append((fn, gt, ai))
    else:
        wrong_same.append((fn, gt, ai))

print(f"\n=== Error Categories ({len(wrong)} total) ===")
print(f"  Empty/zero:          {len(empty)}")
print(f"  GT in AI (decimal):  {len(gt_in_ai)}")
print(f"  AI in GT (truncated):{len(ai_in_gt)}")
print(f"  One digit off:       {len(one_off)}")
print(f"  Wrong shorter:       {len(wrong_shorter)}")
print(f"  Wrong longer:        {len(wrong_longer)}")
print(f"  Wrong same-len:      {len(wrong_same)}")

def show(label, items):
    print(f"\n--- {label} ({len(items)}) ---")
    for fn, gt, ai in sorted(items, key=lambda x: x[1]):
        print(f"  GT={gt:>6s}  AI={ai:>8s}  {fn}")

show("Empty/zero", empty)
show("GT in AI (decimal leak)", gt_in_ai)
show("AI in GT (truncated)", ai_in_gt)
show("One digit off", one_off)
show("Wrong shorter", wrong_shorter)
show("Wrong longer", wrong_longer)
show("Wrong same-length", wrong_same)

print(f"\n--- Error by GT length ---")
gt_lens = Counter(len(r.get('gt_norm','')) for r in wrong if r.get('gt_norm'))
gt_all = Counter(len(r.get('gt_norm','')) for r in rows if r.get('gt_norm'))
for l in sorted(gt_all):
    total = gt_all[l]
    errs = gt_lens.get(l, 0)
    corr = total - errs
    print(f"  GT len={l}: {corr}/{total} correct ({100*corr/total:.0f}%)")

print(f"\n--- AI reading length for wrong readings ---")
ai_lens = Counter(len(r.get('ai_norm','')) for r in wrong)
for l in sorted(ai_lens):
    print(f"  AI len={l}: {ai_lens[l]}")
