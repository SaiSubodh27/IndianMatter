import os
TERMS=['38510','datasets','Obliex_cifs','indianmatter','pretrained_models','Surrogative_models','CrystalFormer','chgnet_logK']
SKIP={'venv','.venv','node_modules','__pycache__','.git','site-packages','dist','build'}
TOP_SKIP={'src','public','docs','tools'}
CODE=('.py','.ps1','.sh','.js','.ipynb')
hits={t:[] for t in TERMS}
for dp,dirs,fs in os.walk('.'):
    dirs[:]=[d for d in dirs if d not in SKIP and not (dp=='.' and d in TOP_SKIP)]
    for f in fs:
        p=os.path.join(dp,f)
        if f.endswith(CODE) and os.path.getsize(p)<=3_000_000:
            for i,line in enumerate(open(p,errors='ignore'),1):
                for t in TERMS:
                    if t in line: hits[t].append(p+':'+str(i))
for t in TERMS:
    print(t,'files',len({h.rsplit(':',1)[0] for h in hits[t]}))
    for h in hits[t][:3]: print('  ',h)
