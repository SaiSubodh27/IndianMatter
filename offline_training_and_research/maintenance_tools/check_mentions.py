import os,re
names=['download_all_models','download_m3gnet','download_m3gnet_hf','download_m3gnet_manual','redownload_m3gnet','unified_m3gnet_approach']
SKIP={'venv','.venv','node_modules','__pycache__','.git','site-packages','dist','build','CrystalFormer','src','public','docs','tools'}
EXT=('.py','.ps1','.sh','.js','.json','.md','.txt','.yml','.yaml','.bat','.cmd','.ipynb')
hits={n:[] for n in names}
for dp,dirs,fs in os.walk('.'):
    dirs[:]=[d for d in dirs if d not in SKIP]
    for f in fs:
        p=os.path.join(dp,f)
        if f.endswith(EXT) and os.path.getsize(p)<=3000000:
            t=open(p,errors='ignore').read()
            for n in names:
                if f!=n+'.py' and re.search(r'(?<![\w])'+n+r'(?![\w])',t): hits[n].append(p)
for n in names: print(n,len(hits[n]),hits[n][:3])
