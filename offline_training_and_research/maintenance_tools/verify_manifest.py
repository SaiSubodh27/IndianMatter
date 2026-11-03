import csv,os,hashlib
base={r['relpath']:r['sha256'] for r in csv.DictReader(open('docs/manifests/baseline_2026-10-28_v3.csv'))}
moved={}
if os.path.exists('docs/MOVE_LOG.csv'):
    for r in csv.DictReader(open('docs/MOVE_LOG.csv')): moved[os.path.normpath(r['old'])]=os.path.normpath(r['new'])
def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(65536),b''): h.update(c)
    return h.hexdigest()
missing=changed=0
for rel,h in base.items():
    if rel.startswith(('docs'+os.sep,'tools'+os.sep)): continue
    p=moved.get(os.path.normpath(rel),rel)
    if not os.path.isfile(p):
        missing+=1
        if missing+changed<=20: print('MISSING',rel)
    elif sha(p)!=h:
        changed+=1
        if missing+changed<=20: print('CHANGED',rel)
print('checked',len(base),'missing',missing,'changed',changed)
