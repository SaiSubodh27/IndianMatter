import os, hashlib, csv, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTS = {'.csv','.cif','.pkl','.joblib','.pt','.pth','.h5','.onnx','.cbm','.json','.zip'}
OUT = os.path.join(ROOT, 'docs', 'manifests', f"baseline_{datetime.date.today().isoformat()}.csv")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

rows=[]
for dp,_,fs in os.walk(ROOT):
    for f in fs:
        if os.path.splitext(f)[1].lower() in EXTS:
            p=os.path.join(dp,f)
            h=hashlib.sha256()
            with open(p,'rb') as fh:
                for chunk in iter(lambda:fh.read(65536),b''):
                    h.update(chunk)
            rows.append((os.path.relpath(p,ROOT), os.path.getsize(p), h.hexdigest()))
rows.sort()
with open(OUT,'w',newline='') as fh:
    w=csv.writer(fh); w.writerow(['relpath','size','sha256']); w.writerows(rows)
print("files:", len(rows))
print("total bytes:", sum(r[1] for r in rows))
print("manifest:", OUT)
