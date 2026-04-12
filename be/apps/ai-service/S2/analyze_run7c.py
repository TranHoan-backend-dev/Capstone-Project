import csv

rows = list(csv.DictReader(open('test_eval_results.csv', encoding='utf-8')))
wrong = [r for r in rows if r['result'] == 'Wrong']
print(f'Total wrong: {len(wrong)}')
print()

# Categorize errors
empty = [r for r in wrong if not r['ai_norm'] or r['ai_norm'] == '0']
gt_in_ai = [r for r in wrong if r not in empty and r['gt_norm'] in r['ai_norm'] and len(r['ai_norm']) > len(r['gt_norm'])]
ai_in_gt = [r for r in wrong if r not in empty and r not in gt_in_ai and r['ai_norm'] in r['gt_norm'] and len(r['gt_norm']) > len(r['ai_norm'])]

rest = [r for r in wrong if r not in empty and r not in gt_in_ai and r not in ai_in_gt]

# One digit off
one_off = []
for r in rest:
    g, a = r['gt_norm'], r['ai_norm']
    if len(g) == len(a) and len(g) > 0:
        diffs = sum(1 for i in range(len(g)) if g[i] != a[i])
        if diffs == 1:
            one_off.append(r)

completely_wrong = [r for r in rest if r not in one_off]

print(f'=== Empty/zero: {len(empty)} ===')
for r in empty[:10]:
    print(f'  GT={r["gt_norm"]} AI="{r["ai_norm"]}"  ({r["image"][:50]})')
if len(empty) > 10:
    print(f'  ... and {len(empty)-10} more')

print(f'\n=== GT in AI (decimal leak): {len(gt_in_ai)} ===')
for r in gt_in_ai:
    print(f'  GT={r["gt_norm"]} AI={r["ai_norm"]}')

print(f'\n=== AI in GT (truncated): {len(ai_in_gt)} ===')
for r in ai_in_gt:
    print(f'  GT={r["gt_norm"]} AI={r["ai_norm"]}')

print(f'\n=== One digit off: {len(one_off)} ===')
for r in one_off:
    g, a = r['gt_norm'], r['ai_norm']
    pos = next(i for i in range(len(g)) if g[i] != a[i])
    print(f'  GT={g} AI={a}  (pos {pos}: {g[pos]}->{a[pos]})')

print(f'\n=== Completely wrong: {len(completely_wrong)} ===')
shorter = [r for r in completely_wrong if len(r['ai_norm']) < len(r['gt_norm'])]
longer = [r for r in completely_wrong if len(r['ai_norm']) > len(r['gt_norm'])]
same = [r for r in completely_wrong if len(r['ai_norm']) == len(r['gt_norm'])]
print(f'  AI shorter: {len(shorter)}')
for r in shorter:
    print(f'    GT={r["gt_norm"]}({len(r["gt_norm"])}) AI={r["ai_norm"]}({len(r["ai_norm"])})')
print(f'  AI longer: {len(longer)}')
for r in longer:
    print(f'    GT={r["gt_norm"]}({len(r["gt_norm"])}) AI={r["ai_norm"]}({len(r["ai_norm"])})')
print(f'  Same length: {len(same)}')
for r in same:
    print(f'    GT={r["gt_norm"]} AI={r["ai_norm"]}')

# GT length distribution for correct vs wrong
correct = [r for r in rows if r['result'] == 'Correct']
print(f'\n=== GT length distribution ===')
for length in range(1, 7):
    c = len([r for r in correct if len(r['gt_norm']) == length])
    w = len([r for r in wrong if len(r['gt_norm']) == length])
    total = c + w
    if total > 0:
        print(f'  GT len={length}: {c}/{total} correct ({100*c/total:.0f}%)')
