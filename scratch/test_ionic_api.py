import urllib.request
import urllib.parse
import json

def test_lookup(formula):
    url = f"http://localhost:8000/api/calculations/lookup?query={urllib.parse.quote(formula)}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            found = data.get("found", True)
            m = data.get("metrics", {})
            fp = data.get("full_prediction", {})
            ion_prop = fp.get("properties", {}).get("ionic_conductivity", {})
            cif_len = len(data.get("cif_content", "") or data.get("cif_text", "") or "")
            print(f"[{formula}] found={found}")
            print(f"   ionic_conductivity (metrics): {m.get('ionic_conductivity_S_cm')} S/cm")
            print(f"   activation_energy  (metrics): {m.get('activation_energy_eV')} eV")
            print(f"   full_prediction status: {ion_prop.get('status')}, value: {ion_prop.get('value')} {ion_prop.get('unit')}, model: {ion_prop.get('source_model')}")
            print(f"   cif_content length: {cif_len} bytes")
    except Exception as e:
        print(f"[{formula}] FAILED:", e)

if __name__ == "__main__":
    test_list = ["Li3PS4", "LiCl", "Li56La24Zr16O96", "Fe2O3", "LiCoO2", "Na3Zr2Si2PO12"]
    for f in test_list:
        test_lookup(f)
