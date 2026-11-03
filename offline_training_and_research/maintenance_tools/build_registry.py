import os,csv,collections
WEIGHT=('.pkl','.pt','.pth','.h5','.onnx','.cbm','.ckpt','.safetensors')
SKIP={'venv','.venv','node_modules','__pycache__','.git','site-packages','dist','build'}
TOP_SKIP={'src','public','docs','tools'}
CODE=('.py','.ps1','.sh','.js','.ipynb')
M='docs/manifests/baseline_2026-10-28_v3.csv'
rows=[r for r in csv.DictReader(open(M)) if r['relpath'].lower().endswith(WEIGHT)]
texts={}
for dp,dirs,fs in os.walk('.'):
    dirs[:]=[d for d in dirs if d not in SKIP and not (dp=='.' and d in TOP_SKIP)]
    for f in fs:
        p=os.path.join(dp,f)
        if f.endswith(CODE) and os.path.getsize(p)<=3_000_000:
            texts[os.path.normpath(p)]=open(p,errors='ignore').read()
names=collections.Counter(os.path.basename(r['relpath']) for r in rows)
shas=collections.Counter(r['sha256'] for r in rows)
out=[]
for r in rows:
    name=os.path.basename(r['relpath'])
    users=[p for p,t in texts.items() if name in t]
    live=[p for p in users if p.startswith('backend') and 'CrystalFormer' not in p and not p.endswith('.ipynb') and 'train' not in os.path.basename(p).lower()]
    if live: status='ACTIVE' if names[name]==1 else 'AMBIGUOUS-same-name'
    elif users: status='REFERENCE'
    else: status='UNKNOWN-no-name-hit'
    out.append([os.path.dirname(r['relpath']),name,round(int(r['size'])/1048576,2),status,(live or users or ['NONE'])[0],'DUP' if shas[r['sha256']]>1 else ''])
out.sort()
with open('docs/MODEL_REGISTRY.csv','w',newline='') as fh:
    w=csv.writer(fh); w.writerow(['folder','file','size_mb','status','first_user','dup_hash']); w.writerows(out)
print(collections.Counter(o[3] for o in out))
print('files sharing a hash with another file:',sum(1 for o in out if o[5]=='DUP'))
c=collections.Counter((o[0].split(os.sep)[0]+os.sep+(o[0].split(os.sep)[1] if os.sep in o[0] else ''),o[3]) for o in out)
for k,v in sorted(c.items())[:20]: print(k,v)
