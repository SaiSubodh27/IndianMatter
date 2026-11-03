import os,hashlib,csv,datetime
from collections import Counter
ROOT=r"C:\Users\saisu\OneDrive\Desktop\Final_ validation"
EXCLUDE={'.venv','venv','node_modules','.git','__pycache__'}
EXTS={'.csv','.cif','.pkl','.joblib','.pt','.pth','.h5','.onnx','.cbm','.json','.zip','.ckpt','.safetensors'}
OUT=os.path.join(ROOT,'docs','manifests','baseline_2026-10-28_v2.csv')
rows=[]
for dp,dirs,fs in os.walk(ROOT):
    dirs[:]=[d for d in dirs if d not in EXCLUDE]
    for f in fs:
        if os.path.splitext(f)[1].lower() in EXTS:
            p=os.path.join(dp,f)
            h=hashlib.sha256()
            with open(p,'rb') as fh:
                for c in iter(lambda:fh.read(65536),b''): h.update(c)
            rows.append((os.path.relpath(p,ROOT),os.path.getsize(p),h.hexdigest()))
rows.sort()
os.makedirs(os.path.dirname(OUT),exist_ok=True)
with open(OUT,'w',newline='') as fh:
    w=csv.writer(fh); w.writerow(['relpath','size','sha256']); w.writerows(rows)
print('files',len(rows),'bytes',sum(r[1] for r in rows))
print(Counter(os.path.splitext(x[0])[1].lower() for x in rows))
