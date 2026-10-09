# frontend/ — Web UI

Static HTML/CSS/JS served directly by FastAPI (no build step, no bundler).

| File | Purpose |
|---|---|
| `index.html` | Main query page: formula input, doping controls, results workspace. |
| `style.css` | Design system: dark/light themes, layout, animations. |
| `app.js` | All frontend behaviour: API calls, form handling, CIF display, polymorph picker. |
| `batch.html` | Batch benchmark page. |
| `subjects.html` | Compound browser by material class. |
| `plan.html` | Doping plan viewer — site analysis shown before generating. |
| `mother_compound.html` | Parent structure viewer. |
| `manual_entries.html` | Manual CIF entry / import. |
| `on_source.html` | Source selection and explanation. |
| `other_source.html` | Alternative source browser. |

## Note: the 3D viewer was removed

The 3Dmol.js crystal viewer has been retired from the workflow. Its CDN script
tag, its tab, its control buttons and its JavaScript were all removed.

`app.js` still defines three **no-op shims** — `initViewer()`,
`applyViewerStyle()` and `loadCifIntoViewer()` — so that any stale call site
fails silently instead of throwing. They can be deleted once all callers are
gone. Polymorph selection now switches to the **CIF Source** tab instead of the
viewer.

## API endpoints used

| Endpoint | Used by |
|---|---|
| `POST /api/parse-formula` | Live formula/classification preview as the user types. Returns the `classification` block (family, structure type, candidate sites, sublattice spec). |
| `POST /api/generate` | Main generation run. |
| `POST /api/doped-cif` | Dedicated doped-compound pipeline (family → regime → fraction → representation → checks). |
| `POST /api/resolve-disambiguation` | Polymorph / site disambiguation pick. |
| `GET /api/health` | Telemetry panel (MACE model, CrystaLLM checkpoint state). |

Fractions arrive pre-rounded to two decimals, with an `*_exact` companion field
alongside, so the UI can display the rounded value without discarding precision.
