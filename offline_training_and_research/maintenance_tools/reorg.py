import os,sys,csv,hashlib,shutil,datetime
PLAN='docs/plan_2a.csv'; LOG='docs/MOVE_LOG.csv'; DEST='ml/legacy_scripts'
def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(65536),b''): h.update(c)
    return h.hexdigest()
def mentioned(name):
    out=[]
    for f in os.listdir('.'):
        if f.endswith(('.ps1','.sh','.md','.json','.txt','.yml','.yaml','.bat','.cmd')) and os.path.isfile(f) and os.path.getsize(f)<2000000:
            if name in open(f,errors='ignore').read(): out.append(f)
    return out
mode=sys.argv[1] if len(sys.argv)>1 else 'plan'
if mode=='plan':
    rows=[]
    for f in sorted(os.listdir('.')):
        if f.endswith('.py') and os.path.isfile(f):
            m=mentioned(f)
            if m: print('STAYS',f,'(mentioned in',m,')')
            else: rows.append((f,os.path.join(DEST,f),'loose root script, no importers, no launcher mentions'))
    with open(PLAN,'w',newline='') as fh:
        w=csv.writer(fh); w.writerow(['old','new','reason']); w.writerows(rows)
    print(len(rows),'planned moves:')
    for r in rows: print(' ',r[0],'->',r[1])
else:
    log=[]
    for r in csv.DictReader(open(PLAN)):
        o,n=r['old'],r['new']
        if not os.path.isfile(o): print('SKIP missing',o); continue
        if os.path.exists(n): print('SKIP target exists',n); continue
        if mode=='dry': print('WOULD MOVE',o,'->',n); continue
        os.makedirs(os.path.dirname(n),exist_ok=True)
        h1=sha(o); shutil.move(o,n); h2=sha(n)
        print('MOVED' if h1==h2 else 'HASH MISMATCH',o,'->',n)
        log.append([o,n,h2,r['reason'],datetime.datetime.now().isoformat(timespec='seconds')])
    if log:
        new=not os.path.exists(LOG)
        with open(LOG,'a',newline='') as fh:
            w=csv.writer(fh)
            if new: w.writerow(['old','new','sha256','reason','time'])
            w.writerows(log)
