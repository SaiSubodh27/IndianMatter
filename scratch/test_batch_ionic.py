import urllib.request
import uuid
import json
import time

def post_multipart(url, fields, files):
    boundary = uuid.uuid4().hex
    body = bytearray()
    for name, value in fields.items():
        body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode('utf-8'))
    for name, (filename, content) in files:
        body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"; filename="{filename}"\r\nContent-Type: application/octet-stream\r\n\r\n'.encode('utf-8'))
        body.extend(content if isinstance(content, bytes) else content.encode('utf-8'))
        body.extend(b'\r\n')
    body.extend(f'--{boundary}--\r\n'.encode('utf-8'))
    req = urllib.request.Request(url, data=body)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def run():
    files = []
    for fname in ['Li3PS4.cif', 'LiCl.cif']:
        with open(f'sample_cifs/{fname}', 'r', encoding='utf-8') as f:
            files.append(('files', (fname, f.read())))

    print("Submitting batch prediction with ionic_conductivity...")
    start_resp = post_multipart(
        'http://localhost:8000/api/calculations/batch-predict',
        fields={'properties': 'ionic_conductivity,bulk_modulus,band_gap', 'temperature': '298.15'},
        files=files
    )
    job_id = start_resp.get('job_id')
    print('Batch job started! ID:', job_id, 'Status:', start_resp.get('status'))

    for _ in range(15):
        time.sleep(1)
        st_req = urllib.request.urlopen(f'http://localhost:8000/api/calculations/batch-predict/status/{job_id}')
        st_data = json.loads(st_req.read().decode())
        print(f"  Job {job_id} progress: {st_data.get('completed')}/{st_data.get('total')} ({st_data.get('status')})")
        if st_data.get('status') == 'completed':
            break

    res_req = urllib.request.urlopen(f'http://localhost:8000/api/calculations/batch-predict/results/{job_id}')
    res_data = json.loads(res_req.read().decode())
    print("\nBatch Results Summary:")
    for row in res_data.get('results', []):
        print(f"  File: {row.get('filename')} | Formula: {row.get('formula')}")
        print(f"    Ionic Conductivity: {row.get('ionic_conductivity_S_cm')} S/cm")
        print(f"    Bulk Modulus:       {row.get('bulk_modulus_GPa')} GPa")
        print(f"    Band Gap:           {row.get('band_gap_eV')} eV")

if __name__ == '__main__':
    run()

