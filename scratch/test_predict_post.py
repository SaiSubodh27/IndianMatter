import urllib.request
import uuid
import json

def post_multipart(url, fields, files):
    boundary = uuid.uuid4().hex
    body = bytearray()
    for name, value in fields.items():
        body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode('utf-8'))
    for name, (filename, content) in files.items():
        body.extend(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"; filename="{filename}"\r\nContent-Type: application/octet-stream\r\n\r\n'.encode('utf-8'))
        body.extend(content if isinstance(content, bytes) else content.encode('utf-8'))
        body.extend(b'\r\n')
    body.extend(f'--{boundary}--\r\n'.encode('utf-8'))
    req = urllib.request.Request(url, data=body)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def run():
    with open('sample_cifs/Li3PS4.cif', 'r', encoding='utf-8') as f:
        cif_text = f.read()

    print("Sending POST /api/calculations/predict-properties for Li3PS4.cif...")
    res = post_multipart(
        'http://localhost:8000/api/calculations/predict-properties',
        fields={'properties': 'ionic_conductivity,bulk_modulus,shear_modulus,band_gap,formation_energy'},
        files={'file': ('Li3PS4.cif', cif_text)}
    )
    print('Response status:', res.get('status'))
    print('Model used:', res.get('model_used'))
    props = res.get('properties', {})
    for k in ['ionic_conductivity', 'bulk_modulus', 'shear_modulus', 'band_gap', 'formation_energy']:
        p = props.get(k, {})
        print(f"  {k}: {p.get('value')} {p.get('unit')} (status={p.get('status')}, model={p.get('source_model')})")
    raw_details = props.get('ionic_conductivity', {}).get('raw_details', {})
    if raw_details:
        print("  Ionic Details:", {k: raw_details[k] for k in ['conductivity_s_cm', 'activation_energy_ev', 'base_conductivity_s_cm', 'reliability_status'] if k in raw_details})

if __name__ == '__main__':
    run()

