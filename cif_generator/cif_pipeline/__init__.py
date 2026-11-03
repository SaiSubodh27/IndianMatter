"""cif_pipeline — doped-CIF generation and validation package.

Two public entry points cover the two ways in:
  orchestrator.run_pipeline   full database -> generate -> dope -> relax flow
  dopant_pipeline.generate_doped_cif / generate_cif_from_formula
                             decision layer: family -> regime -> fraction ->
                             representation -> verify -> emit

See README.md (package map), docs/ARCHITECTURE.md (tree + flow) and
docs/WORKFLOW.md (end-to-end diagram).
"""
from .models import CompoundQuery, DopingSpec, SearchMatch, GenerationDiagnostics, PipelineResult, RecognitionResult
from .orchestrator import run_pipeline
from .recognition import recognize_compound_formula
from .config import get_mp_api_key, get_mace_model, get_mace_device, get_crystallm_checkpoint
from .site_preference import (
    recommend_site, recommend_spinel_site, recommend_perovskite_site,
    detect_structure_type, get_shannon_radius, get_cfse,
    check_size_compatibility, compute_charge_balance,
    goldschmidt_tolerance_factor, get_vegard_lattice_parameter,
    SHANNON_RADII, SPINEL_SITE_TABLE, PEROVSKITE_SITE_TABLE,
    CFSE_OCTAHEDRAL_PREFERENCE, COMMON_OXIDATION_STATES,
)
from .intent import interpret as interpret_spinel, from_request as spinel_from_request, describe_intent
from .spinel_cif import write_spinel_cif, readback_check
from .general_doping import (
    DopingError, analyze_parent, resolve_site, rank_substitution,
    compensation_options, plan, build, verify, write_cif_with_meta,
    ligand_field_sensitive,
)
from .parents import get_parent
from .family import classify_family, FamilyInfo, SiteRole
from .regime import decide_regime, inversion_to_sublattices, detect_jahn_teller, RegimeResult
from .fractions import resolve_neat_fraction, neat_fraction, FractionPlan
from .representation import (
    choose_technique, build_representations, build_sqs, build_enumerate,
    build_ensemble, rank_representations, Representation, REPRESENTATION_MODES,
)
from .dopant_pipeline import (
    DopantRequest, DopedCifResult, Check, generate_doped_cif,
    generate_cif_from_formula,
)
from .validation import error_vector, validation_scope, is_ensemble
from .supercell import find_supercell, hermite_normal_forms, SupercellChoice
from .symmetry_paths import (
    build_tetragonal_spinel, build_tetragonal_distortion,
    strain_cubic_to_tetragonal, c_over_a_for, detect_space_group, symmetrize,
    TETRAGONAL_C_OVER_A, DistortedBuild,
)
from .ordering import (
    order_doped_supercell, ClusterExpansion, OrderingResult,
)
from .mlip import make_mace_energy_fn, try_make_energy_fn

__all__ = [
    "CompoundQuery", "DopingSpec", "SearchMatch", "GenerationDiagnostics", "PipelineResult", "RecognitionResult",
    "run_pipeline",
    "recognize_compound_formula",
    "get_mp_api_key", "get_mace_model", "get_mace_device", "get_crystallm_checkpoint",
    # Site preference KB
    "recommend_site", "recommend_spinel_site", "recommend_perovskite_site",
    "detect_structure_type", "get_shannon_radius", "get_cfse",
    "check_size_compatibility", "compute_charge_balance",
    "goldschmidt_tolerance_factor", "get_vegard_lattice_parameter",
    "SHANNON_RADII", "SPINEL_SITE_TABLE", "PEROVSKITE_SITE_TABLE",
    "CFSE_OCTAHEDRAL_PREFERENCE", "COMMON_OXIDATION_STATES",
    # Spinel intent
    "interpret_spinel", "spinel_from_request", "describe_intent",
    # Spinel CIF
    "write_spinel_cif", "readback_check",
    # Universal general doping engine
    "DopingError", "analyze_parent", "resolve_site", "rank_substitution",
    "compensation_options", "plan", "build", "verify", "write_cif_with_meta",
    "ligand_field_sensitive",
    "get_parent",
    # Doped-CIF decision layer
    "classify_family", "FamilyInfo", "SiteRole",
    "decide_regime", "inversion_to_sublattices", "detect_jahn_teller", "RegimeResult",
    "resolve_neat_fraction", "neat_fraction", "FractionPlan",
    "choose_technique", "build_representations", "build_sqs", "build_enumerate",
    "build_ensemble", "rank_representations", "Representation", "REPRESENTATION_MODES",
    "DopantRequest", "DopedCifResult", "Check", "generate_doped_cif",
    "generate_cif_from_formula",
    "error_vector",
    "validation_scope", "is_ensemble",
    # Supercell search (Hermite normal forms)
    "find_supercell", "hermite_normal_forms", "SupercellChoice",
    # Distorted / Jahn-Teller lattice paths
    "build_tetragonal_spinel", "build_tetragonal_distortion",
    "strain_cubic_to_tetragonal", "c_over_a_for", "detect_space_group",
    "symmetrize", "TETRAGONAL_C_OVER_A", "DistortedBuild",
    # Cluster expansion + Monte Carlo ordering
    "order_doped_supercell", "ClusterExpansion", "OrderingResult",
    # MLIP energy functions
    "make_mace_energy_fn", "try_make_energy_fn",
]
