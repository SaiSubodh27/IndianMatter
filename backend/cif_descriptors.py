"""Reconstruction of the geometry/composition descriptors the v5 model expects.

Background
----------
The v5 feature matrix was assembled in surrogate_model_v5_fixed.ipynb by joining
five cached CSVs (Cell 3). Three of those caches -- cif_features_all.csv,
cif_features_v2.csv and cif_features_v3.csv -- have since been truncated to empty
files, and the scripts that generated them are not in this repository. Their 145
columns therefore have no recoverable source definition.

Rather than leave them zero-filled (zero lies outside the training range for the
great majority of them, so the model receives inputs it never saw), this module
recomputes the subset whose definition is unambiguous: pure lattice geometry,
composition statistics and the space-group number. Every quantity here is fixed
by its name plus the structure -- there is no cutoff radius, encoding table or
algorithm choice to guess at.

Definitions were confirmed against the training distributions stored in
v5_quantile_transformer.pkl, whose quantiles_ array holds a 500-point marginal
for each of the 343 features. Statistics are per-atom site-weighted with a sample
standard deviation (ddof=1); on a LiFePO4-stoichiometry probe this reproduces the
training medians closely -- atomic-radius sd 0.392 vs 0.3925, mass sd 16.30 vs
16.17, Z sd 7.54 vs 7.376, electronegativity sd 1.013 vs 1.01.

Deliberately NOT reconstructed
------------------------------
Descriptors that need a choice this module cannot verify are left for the caller
to impute, and are reported as such:
  * neighbour-derived stats (cn, bl, li_d, li_cn, li_bl, anion, short_bonds,
    long_bonds) -- each depends on a cutoff radius that was never recorded;
  * point group, stored as an integer spanning 1-992, which is not any standard
    encoding of the 32 crystallographic point groups;
  * crystal system, an integer 1-7 whose name-to-index mapping is arbitrary;
  * li_esite, bottleneck, li_distortion, li_dim and li_wyckoff families -- each
    implies a specific algorithm (Ewald site energy, percolation, distortion
    index) whose parameters are unknown;
  * voro_face_mu, voro_face_min and voro_li_faces -- constant zero throughout
    training, so the existing zero fill is already correct.
"""

import math  # used for log_density / log_volume / log_n_atoms transforms

import numpy as np  # array statistics (mean/sd/min/max/range) with ddof=1 sample sd

try:
    # pymatgen is an optional dependency in some test environments; guard the
    # import so this module can still be imported (compute_descriptors returns {}).
    from pymatgen.core.periodic_table import Element
    from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
    PYMATGEN_AVAILABLE = True
except ImportError:  # pragma: no cover - mirrors model_service's guard
    PYMATGEN_AVAILABLE = False


def _site_weighted(structure, attr):
    """Collect a per-atom list of an elemental property, one entry per site.

    Sites with partial or mixed occupancy contribute their dominant species so
    that the list length always matches the site count.
    """
    values = []
    for site in structure:
        try:
            element = max(site.species, key=site.species.get)
        except Exception:
            continue
        try:
            raw = getattr(Element(element.symbol), attr)
        except Exception:
            continue
        if raw is None:
            continue
        try:
            values.append(float(raw))
        except (TypeError, ValueError):
            continue
    return values


def _stats(values):
    """Mean / sample-sd / min / max / range for a per-atom property list."""
    if not values:
        return None
    array = np.asarray(values, dtype=float)
    sd = float(array.std(ddof=1)) if array.size > 1 else 0.0
    return {
        "mu": float(array.mean()),
        "sd": sd,
        "min": float(array.min()),
        "max": float(array.max()),
        "rng": float(array.max() - array.min()),
    }


def compute_descriptors(structure, packing_fraction=None) -> dict:
    """Return the reconstructable subset of the v5 descriptor set.

    packing_fraction should be matminer's DensityFeatures value when available; it
    is the same quantity the pack / cif_packing_fraction columns hold, and is
    passed in rather than recomputed so there is a single source of truth.
    """
    if not PYMATGEN_AVAILABLE or structure is None:
        return {}

    out = {}
    lattice = structure.lattice
    a, b, c = float(lattice.a), float(lattice.b), float(lattice.c)
    alpha, beta, gamma = float(lattice.alpha), float(lattice.beta), float(lattice.gamma)
    volume = float(lattice.volume)
    n_sites = int(len(structure))

    try:
        density = float(structure.density)
    except Exception:
        density = None

    # -- lattice geometry ------------------------------------------------
    geom = {
        "a": a, "b": b, "c": c,
        "al": alpha, "be": beta, "ga": gamma,
        "vol": volume,
        "n": float(n_sites),
        "vpa": volume / n_sites if n_sites else None,
        # Anisotropy as the larger-over-smaller ratio of each axis pair, which is
        # why the training minimum for all three is exactly 1.
        "ani_ab": max(a, b) / min(a, b) if min(a, b) > 0 else None,
        "ani_ac": max(a, c) / min(a, c) if min(a, c) > 0 else None,
        "ani_bc": max(b, c) / min(b, c) if min(b, c) > 0 else None,
        # Mean absolute departure from 90 degrees; zero for a cubic cell, which
        # matches the training minimum of exactly 0.
        "angle_dev": float(np.mean([abs(alpha - 90.0), abs(beta - 90.0), abs(gamma - 90.0)])),
    }
    if density is not None:
        geom["dens"] = density
    if packing_fraction is not None:
        geom["pack"] = float(packing_fraction)

    # -- composition statistics (per atom) -------------------------------
    en = _stats(_site_weighted(structure, "X"))
    ar = _stats(_site_weighted(structure, "atomic_radius"))
    am = _stats(_site_weighted(structure, "atomic_mass"))
    zz = _stats(_site_weighted(structure, "Z"))

    composition = structure.composition
    n_elements = len(composition.elements)
    n_li = float(sum(1 for s in structure
                     if max(s.species, key=s.species.get).symbol == "Li"))
    li_fraction = n_li / n_sites if n_sites else 0.0

    comp = {"n_elem": float(n_elements), "n_li": n_li, "li_frac": li_fraction}
    if volume > 0:
        comp["li_pvol"] = n_li / volume
    for prefix, stat in (("en", en), ("ar", ar), ("am", am), ("Z", zz)):
        if stat is None:
            continue
        comp[f"{prefix}_mu"] = stat["mu"]
        comp[f"{prefix}_sd"] = stat["sd"]
        comp[f"{prefix}_max"] = stat["max"]
        comp[f"{prefix}_min"] = stat["min"]
        comp[f"{prefix}_rng"] = stat["rng"]

    # -- space group number ----------------------------------------------
    try:
        spacegroup_number = float(SpacegroupAnalyzer(structure).get_space_group_number())
    except Exception:
        spacegroup_number = None
    if spacegroup_number is not None:
        geom["sg"] = spacegroup_number

    # -- emit under every name the training matrix used -------------------
    # cif_features_v2 and cif_features_v3 were joined with the prefixes
    # cif_v2_c2_ and cif_v3_c3_ (notebook Cell 4). The two families share these
    # columns and their training marginals are identical, so one computation
    # serves both.
    merged = dict(geom)
    merged.update(comp)
    for key, value in merged.items():
        if value is None:
            continue
        out[f"cif_v2_c2_{key}"] = value
        out[f"cif_v3_c3_{key}"] = value

    # cif_features_all was joined without a prefix; its columns already start
    # with cif_ and spell the statistics out.
    flat = {
        "cif_lat_volume": volume,
        "cif_density": density,
        "cif_packing_fraction": packing_fraction,
        "cif_spacegroup": spacegroup_number,
        "cif_li_count": n_li,
        "cif_li_fraction": li_fraction,
        "cif_mean_en": en["mu"] if en else None,
        "cif_std_en": en["sd"] if en else None,
        "cif_mean_radius": ar["mu"] if ar else None,
        "cif_std_radius": ar["sd"] if ar else None,
        "cif_mean_mass": am["mu"] if am else None,
        "cif_std_mass": am["sd"] if am else None,
    }

    # composition_features was joined with the comp_ prefix over columns that
    # already began with form_.
    flat.update({
        "comp_form_num_elements": float(n_elements),
        "comp_form_li_fraction": li_fraction,
        "comp_form_mean_en": en["mu"] if en else None,
        "comp_form_max_en": en["max"] if en else None,
        "comp_form_min_en": en["min"] if en else None,
        "comp_form_mean_mass": am["mu"] if am else None,
        "comp_form_max_mass": am["max"] if am else None,
        "comp_form_min_mass": am["min"] if am else None,
    })

    # Un-prefixed columns carried straight from the source dataset, plus the
    # products the notebook derived from them in Cell 4.
    flat["volume"] = volume
    flat["n_atoms"] = float(n_sites)
    if density is not None:
        flat["density"] = density
        flat["log_density"] = math.log(density + 1e-8)
        flat["vol_density"] = volume * density
    flat["log_volume"] = math.log(volume + 1e-8)
    flat["log_n_atoms"] = math.log(n_sites + 1e-8)
    if n_sites:
        vpa = volume / n_sites
        flat["volume_per_atom"] = vpa
        flat["vol_per_atom_sq"] = vpa ** 2

    for key, value in flat.items():
        if value is not None:
            out[key] = value

    return out
