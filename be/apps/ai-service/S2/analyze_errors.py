import csv

results = []
with open('test_eval_results.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        results.append(row)

wrong = [r for r in results if r['result']=='Wrong']
correct = [r for r in results if r['result']=='Correct']
print(f'Total: {len(results)}, Correct: {len(correct)}, Wrong: {len(wrong)}')
print()

empty_ai = [r for r in wrong if r['ai'].strip()=='' or r['ai_norm']=='0']
partial_match = [r for r in wrong if r['ai_norm']!='' and r['ai_norm']!='0' and r['gt_norm'] in r['ai_norm']]
partial_gt_in_ai = [r for r in wrong if r['ai_norm']!='' and r['ai_norm']!='0' and r['ai_norm'] in r['gt_norm'] and r not in partial_match]
completely_wrong = [r for r in wrong if r not in empty_ai and r not in partial_match and r not in partial_gt_in_ai]

close = []
for r in wrong:
    ai = r['ai_norm']
    gt = r['gt_norm']
    if ai and gt and len(ai)==len(gt):
        diff = sum(1 for a,b in zip(ai,gt) if a!=b)
        if diff<=1:
            close.append(r)

print(f'=== ERROR CATEGORIES ===')
print(f'1. AI empty/zero: {len(empty_ai)}')
for r in empty_ai[:8]:
    print(f'   GT={r["gt"]:>6} AI="{r["ai"]}"')
print()
print(f'2. GT inside AI (extra digits): {len(partial_match)}')
for r in partial_match[:10]:
    print(f'   GT={r["gt"]:>6} AI={r["ai"]:>10}')
print()
print(f'3. AI substring of GT (short read): {len(partial_gt_in_ai)}')
for r in partial_gt_in_ai[:10]:
    print(f'   GT={r["gt"]:>6} AI={r["ai"]:>10}')
print()
print(f'4. Completely different: {len(completely_wrong)}')
for r in completely_wrong[:10]:
    print(f'   GT={r["gt"]:>6} AI={r["ai"]:>10}')
print()
print(f'5. Close (same len, 1 digit off): {len(close)}')
for r in close[:10]:
    print(f'   GT={r["gt"]:>6} AI={r["ai"]:>10}')
print()
ai_long = [r for r in wrong if r['ai_norm']!='' and r['ai_norm']!='0' and len(r['ai_norm'])>len(r['gt_norm'])+1]
print(f'6. AI much longer (>GT+1 digits): {len(ai_long)}')
for r in ai_long[:10]:
    print(f'   GT={r["gt"]:>6}({len(r["gt_norm"])}) AI={r["ai"]:>10}({len(r["ai_norm"])})')
print()
ai_short = [r for r in wrong if r['ai_norm']!='' and r['ai_norm']!='0' and len(r['ai_norm'])<len(r['gt_norm'])]
print(f'7. AI shorter than GT: {len(ai_short)}')
for r in ai_short[:10]:
    print(f'   GT={r["gt"]:>6}({len(r["gt_norm"])}) AI={r["ai"]:>10}({len(r["ai_norm"])})')
