import csv

rows = list(csv.DictReader(open('test_eval_results.csv', encoding='utf-8')))
print(f'Total rows: {len(rows)}')
correct = [r for r in rows if r['result']=='Correct']
wrong = [r for r in rows if r['result']=='Wrong']
print(f'Correct: {len(correct)}, Wrong: {len(wrong)}')
print()

# Categorize errors
empty = [r for r in wrong if not r['ai'].strip() or r['ai_norm'].strip()=='0']
print(f'=== EMPTY/ZERO AI ({len(empty)}) ===')
for r in empty:
    print(f'  GT={r["gt"]:>6}  AI="{r["ai"]}"  img={r["image"][:50]}')

non_empty = [r for r in wrong if r['ai'].strip() and r['ai_norm'].strip()!='0']
print(f'\n=== NON-EMPTY WRONG ({len(non_empty)}) ===')

# Sub-categorize
gt_in_ai = []
ai_in_gt = []
off_by_one_digit = []
completely_wrong = []
for r in non_empty:
    gt = r['gt'].strip()
    ai = r['ai'].strip()
    if gt in ai:
        gt_in_ai.append(r)
    elif ai in gt:
        ai_in_gt.append(r)
    elif len(gt) == len(ai):
        diff = sum(1 for a,b in zip(gt,ai) if a!=b)
        if diff <= 1:
            off_by_one_digit.append(r)
        else:
            completely_wrong.append(r)
    else:
        completely_wrong.append(r)

print(f'\n--- GT inside AI (decimal leak/extra digits): {len(gt_in_ai)} ---')
for r in gt_in_ai:
    print(f'  GT={r["gt"]:>6}  AI={r["ai"]:>10}')

print(f'\n--- AI inside GT (truncated): {len(ai_in_gt)} ---')
for r in ai_in_gt:
    print(f'  GT={r["gt"]:>6}  AI={r["ai"]:>10}')

print(f'\n--- Same length, 1 digit off: {len(off_by_one_digit)} ---')
for r in off_by_one_digit:
    print(f'  GT={r["gt"]:>6}  AI={r["ai"]:>10}')

print(f'\n--- Completely wrong: {len(completely_wrong)} ---')
# further sub-categorize by digit length relationship
too_short = [r for r in completely_wrong if len(r['ai'].strip()) < len(r['gt'].strip())]
too_long = [r for r in completely_wrong if len(r['ai'].strip()) > len(r['gt'].strip())]
same_len = [r for r in completely_wrong if len(r['ai'].strip()) == len(r['gt'].strip())]
print(f'  AI shorter than GT: {len(too_short)}')
for r in too_short:
    print(f'    GT={r["gt"]:>6} ({len(r["gt"])}d)  AI={r["ai"]:>10} ({len(r["ai"].strip())}d)')
print(f'  AI longer than GT: {len(too_long)}')
for r in too_long:
    print(f'    GT={r["gt"]:>6} ({len(r["gt"])}d)  AI={r["ai"]:>10} ({len(r["ai"].strip())}d)')
print(f'  Same length, >1 digit off: {len(same_len)}')
for r in same_len:
    print(f'    GT={r["gt"]:>6}  AI={r["ai"]:>10}')

# Summary
print(f'\n=== SUMMARY ===')
print(f'Total wrong: {len(wrong)}')
print(f'  Empty/zero: {len(empty)}')
print(f'  GT in AI (decimal leak): {len(gt_in_ai)}')
print(f'  AI in GT (truncated): {len(ai_in_gt)}')
print(f'  1 digit off: {len(off_by_one_digit)}')
print(f'  Completely wrong: {len(completely_wrong)}')
print(f'    - AI shorter: {len(too_short)}')
print(f'    - AI longer: {len(too_long)}')
print(f'    - Same length: {len(same_len)}')
