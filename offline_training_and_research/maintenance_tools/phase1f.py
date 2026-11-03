import csv,collections,os,re
W=('.pkl','.pt','.pth','.h5','.onnx','.cbm','.ckpt','.safetensors')
rows=[r for r in csv.DictReader(open('docs/manifests/baseline_2026-10-28_v3.csv')) if r['relpath'].lower().endswith(W) and 'CrystalFormer' not in r['relpath']]
by=collections.defaultdict(list)
for r in rows: by[os.path.basename(r['relpath'])].append((os.path.dirname(r['relpath']),r['sha256'][:8]))
print('== same file name in several folders (CrystalFormer excluded) ==')
n=0
for name,v in sorted(by.items()):
    if len(v)>1:
        n+=1
        if n<=15: print(name,'SAME' if len({x[1] for x in v})==1 else 'DIFFERENT',[x[0] for x in v])
print('groups',n)
SKIP={'venv','.venv','node_modules','__pycache__','.git','site-packages','dist','build','CrystalFormer'}
root=[f for f in os.listdir('.') if f.endswith('.py')]
mods={f[:-3] for f in root}
users={m:[] for m in mods}
uses_file=[]
for dp,dirs,fs in os.walk('.'):
    dirs[:]=[d for d in dirs if d not in SKIP and not (dp=='.' and d in {'src','public'})]
    for f in fs:
        if f.endswith('.py'):
            p=os.path.join(dp,f); t=open(p,errors='ignore').read()
            if dp=='.' and '__file__' in t: uses_file.append(f)
            for m in mods:
                if p!=os.path.join('.',m+'.py') and re.search(r'^\s*(from|import)\s+'+re.escape(m)+r'\b',t,re.M): users[m].append(p)
print('== loose root scripts ==')
print('root .py files:',len(root),'| imported by another file:',sum(1 for m in mods if users[m]),'| use __file__:',len(uses_file))
for m in sorted(mods):
    if users[m]: print(m,'<-',users[m][:2])
