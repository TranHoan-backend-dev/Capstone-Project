import csv, sys

def load(f):
    with open(f, 'r') as fh:
        return list(csv.DictReader(fh))

f1 = sys.argv[1] if len(sys.argv) > 1 else 'test_eval_results_run8.csv'
f2 = sys.argv[2] if len(sys.argv) > 2 else 'test_eval_results_run10.csv'
r8 = load(f1)
r10 = load(f2)
print(f'R8: {len(r8)} rows, R10: {len(r10)} rows')

r8_ok = sum(1 for r in r8 if r['result'] == 'Correct')
r10_ok = sum(1 for r in r10 if r['result'] == 'Correct')
print(f'R8 OK: {r8_ok}, R10 OK: {r10_ok}')

r8_map = {r['image']: r for r in r8}
r10_map = {r['image']: r for r in r10}

only_r10 = set(r10_map) - set(r8_map)
only_r8 = set(r8_map) - set(r10_map)
print(f'Only in R10: {len(only_r10)}, Only in R8: {len(only_r8)}')

for img in sorted(only_r10):
    r = r10_map[img]
    print(f'  R10 only: {r["result"]} gt={r["gt_norm"]} ai={r["ai_norm"]} | {img[:60]}')
for img in sorted(only_r8):
    r = r8_map[img]
    print(f'  R8 only:  {r["result"]} gt={r["gt_norm"]} ai={r["ai_norm"]} | {img[:60]}')

# Check differences on shared images
shared = set(r8_map) & set(r10_map)
gained = []
lost = []
diffs = []

for img in sorted(shared):
    a = r8_map[img]
    b = r10_map[img]
    if a['ai_norm'] != b['ai_norm']:
        gt = a['gt_norm']
        r8_ai = a['ai_norm']
        r10_ai = b['ai_norm']
        r8_ok_i = a['result'] == 'Correct'
        r10_ok_i = b['result'] == 'Correct'
        diffs.append((img, gt, r8_ai, r10_ai, r8_ok_i, r10_ok_i))
        if not r8_ok_i and r10_ok_i:
            gained.append((img, gt, r8_ai, r10_ai))
        elif r8_ok_i and not r10_ok_i:
            lost.append((img, gt, r8_ai, r10_ai))

print(f'\nTotal AI output differences: {len(diffs)}')
print(f'GAINED (wrong->correct): {len(gained)}')
for g in gained:
    print(f'  GT={g[1]:>6} R8_ai={g[2]:>6} -> R10_ai={g[3]:>6} | {g[0][:55]}')

print(f'\nLOST (correct->wrong): {len(lost)}')
for l in lost:
    print(f'  GT={l[1]:>6} R8_ai={l[2]:>6} -> R10_ai={l[3]:>6} | {l[0][:55]}')

print(f'\nOther diffs (wrong->wrong):')
for d in diffs:
    if d not in [(x[0], x[1], x[2], x[3], False, True) for x in gained] and \
       d not in [(x[0], x[1], x[2], x[3], True, False) for x in lost]:
        img, gt, r8_ai, r10_ai, r8ok, r10ok = d
        if not r8ok and not r10ok:
            print(f'  GT={gt:>6} R8_ai={r8_ai:>6} -> R10_ai={r10_ai:>6} | {img[:55]}')
