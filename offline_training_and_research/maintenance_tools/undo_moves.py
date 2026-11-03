import csv,os,shutil
for r in reversed(list(csv.DictReader(open('docs/MOVE_LOG.csv')))):
    n,o=r['new'],r['old']
    if os.path.isfile(n) and not os.path.exists(o):
        shutil.move(n,o); print('RESTORED',o)
    else: print('SKIP',n)
PY