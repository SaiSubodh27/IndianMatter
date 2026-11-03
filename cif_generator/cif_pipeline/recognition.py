"""
Stage 0 (runs BEFORE classification): compound recognition.

Everything downstream (classify.py's formula-shape heuristic, matching.py's
normalization, search, generation) needs an actual, parseable chemical
formula to work with a pymatgen Composition. Raw user input very often is
NOT that - it's a full sentence, an abbreviation, or a formula written with
formatting pymatgen won't accept as-is. This module is the single front door
that takes whatever the user typed and turns it into a clean formula (or
fails explicitly and asks for a correction), before any other stage touches
Composition() directly.

Things this handles:
  - Full natural-language input containing a formula plus other words
    (e.g. "LaMnO3 doped with 30% Sr") - the formula is EXTRACTED, not
    assumed to be the whole string.
  - Common formatting noise: Unicode subscript/superscript digits, hydrate
    separators (. vs * vs · vs •), trailing state annotations (s)/(aq)/(l)/(g),
    stray whitespace.
  - The "1-x / x=" algebraic doping notation that real papers actually use
    (e.g. "La1-xSrxMnO3, x=0.3") - resolved into an equivalent decimal
    formula before handing off to the rest of the pipeline.
  - Common materials-science abbreviations (LSMO, YBCO, BSCCO, PZT, NMC, etc.)
  - Intelligent case-correction for lowercase inputs (e.g. "limno4" -> "LiMnO4",
    "tio2" -> "TiO2") using periodic table segmentation.
  - Interactive user correction fallback if all automatic methods fail.
"""

from __future__ import annotations
import re
import unicodedata
import logging
from typing import List, Optional

from pymatgen.core import Composition
from .models import RecognitionResult
from .user_interaction import AskUserFn

log = logging.getLogger("cif_pipeline.recognition")

# --- Unicode digit normalization -------------------------------------------
_SUBSCRIPT_DIGITS = "₀₁₂₃₄₅₆₇₈₉"
_SUPERSCRIPT_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹"
_ASCII_DIGITS = "0123456789"
_UNICODE_DIGIT_TRANSLATION = str.maketrans(
    _SUBSCRIPT_DIGITS + _SUPERSCRIPT_DIGITS,
    _ASCII_DIGITS + _ASCII_DIGITS,
)

# --- Trailing state annotations --------------------------------------------
_STATE_ANNOTATION_RE = re.compile(r"\s*\((?i:s|aq|l|g)\)\s*$")

# --- Hydrate separators -----------------------------------------------------
_HYDRATE_SEPARATOR_RE = re.compile(r"[·•*·\u00B7\u2022\u00b7]")

# --- Formula-substring extraction from a longer sentence -------------------
_FORMULA_TOKEN_RUN_RE = re.compile(r"(?:[A-Z][a-z]?\d*(?:\.\d+)?){2,}")

_X_NOTATION_PATTERN_RE = re.compile(
    r"(?P<host>[A-Z][a-z]?)\s*\(?\s*1\s*[-−]\s*x\s*\)?\s*(?P<dopant>[A-Z][a-z]?)\s*(?:\(\s*x\s*\)|x)",
    re.IGNORECASE,
)
_X_VALUE_RE = re.compile(r"\bx\s*=\s*(?P<value>\d*\.?\d+)\b", re.IGNORECASE)

# --- Common abbreviations ---------------------------------------------------
COMMON_ABBREVIATIONS = {
    "LSMO": "La0.7Sr0.3MnO3",
    "LCMO": "La0.7Ca0.3MnO3",
    "YBCO": "YBa2Cu3O7",
    "BSCCO": "Bi2Sr2CaCu2O8",
    "PCMO": "Pr0.7Ca0.3MnO3",
    "YSZ": "ZrO2",
    "BTO": "BaTiO3",
    "PZT": "PbZr0.52Ti0.48O3",
    "LSC": "La0.6Sr0.4CoO3",
    "LSF": "La0.6Sr0.4FeO3",
    "BSTO": "Ba0.5Sr0.5TiO3",
    "BCFZ": "BaCo0.4Fe0.4Zr0.2O3",
    "NMC": "LiNi0.33Mn0.33Co0.33O2",
    "LNO": "LaNiO3",
    "STO": "SrTiO3",
    "LAO": "LaAlO3",
    "YIG": "Y3Fe5O12",          # yttrium iron garnet
    "YAG": "Y3Al5O12",          # yttrium aluminium garnet
    "GGG": "Gd3Ga5O12",         # gadolinium gallium garnet
    "CGO": "CeO2",              # cerium(IV) oxide
    "GDC": "Ce0.9Gd0.1O2",      # gadolinium-doped ceria
    "YSZ": "ZrO2",
    "LATP": "Li1.3Al0.3Ti1.7(PO4)3",
    "LLZO": "Li7La3Zr2O12",     # garnet-type LLZO
    "NCA": "LiNi0.8Co0.1Al0.1O2",
    "LFP": "LiFePO4",
    "LMFP": "LiMn0.5Fe0.5PO4",
    "LCO": "LiCoO2",
    "LMO": "LiMn2O4",
    "TZC": "TiZnCrO4",
    "PFM": "PbFe0.5Nb0.5O3",
}

# Mineral, common and trade names -> formula. Without this table a query like
# "hematite" or "table salt" has no formula-shaped substring to extract and
# recognition fails, even though the user named a perfectly specific compound.
COMMON_NAMES = {
    # Iron oxides
    "hematite": "Fe2O3", "haematite": "Fe2O3", "red iron ore": "Fe2O3",
    "magnetite": "Fe3O4", "lodestone": "Fe3O4", "magnetite ore": "Fe3O4",
    "maghemite": "Fe2O3", "rust": "Fe2O3", "iron oxide": "Fe2O3",
    "wustite": "FeO", "marcasite": "FeS2", "pyrite": "FeS2",
    # Titanium
    "rutile": "TiO2", "anatase": "TiO2", "brookite": "TiO2",
    "titanium dioxide": "TiO2", "titania": "TiO2", "ilmenite": "FeTiO3",
    # Alumina / silicates
    "corundum": "Al2O3", "sapphire": "Al2O3", "ruby": "Al2O3",
    "alumina": "Al2O3", "aluminium oxide": "Al2O3", "aluminum oxide": "Al2O3",
    "quartz": "SiO2", "silica": "SiO2", "sand": "SiO2", "glass": "SiO2",
    "cristobalite": "SiO2", "tridymite": "SiO2", "fused silica": "SiO2",
    # Halides
    "table salt": "NaCl", "rock salt": "NaCl", "halite": "NaCl",
    "sodium chloride": "NaCl", "common salt": "NaCl", "sea salt": "NaCl",
    "fluorite": "CaF2", "fluorspar": "CaF2", "calcium fluoride": "CaF2",
    "cryolite": "Na3AlF6",
    # Carbonates / sulfates
    "calcite": "CaCO3", "limestone": "CaCO3", "marble": "CaCO3",
    "gypsum": "CaSO4", "barite": "BaSO4",
    # Nitrides / sulfides / others
    "galena": "PbS", "zinc blende": "ZnS", "sphalerite": "ZnS",
    "wurtzite": "ZnS", "cinnabar": "HgS", "cinnabarite": "HgS",
    "ilmenite structure": "FeTiO3", "perovskite": "CaTiO3",
    # Ceramics / superconductors
    "barium titanate": "BaTiO3", "strontium titanate": "SrTiO3",
    "lead zirconate titanate": "PbZr0.52Ti0.48O3", "pzt": "PbZr0.52Ti0.48O3",
    "yttria stabilized zirconia": "ZrO2",
    "yttrium iron garnet": "Y3Fe5O12", "yig": "Y3Fe5O12",
    "silicon": "Si", "germanium": "Ge", "copper": "Cu", "aluminium": "Al",
    "aluminum": "Al", "iron": "Fe", "gold": "Au", "silver": "Ag",
    "lead": "Pb", "zinc": "Zn", "nickel": "Ni", "cobalt": "Co",
    "titanium": "Ti", "manganese": "Mn", "chromium": "Cr",
    "water": "H2O", "ice": "H2O", "carbon dioxide": "CO2",
    "sodium oxide": "Na2O", "potassium chloride": "KCl",
}

# Explicit molecular mappings (F8: prevents casing heuristic from turning co2 into Co2)
EXPLICIT_MOLECULAR_MAPPINGS = {
    "CO2": "CO2",
    "CO": "CO",
    "NO2": "NO2",
    "SO2": "SO2",
    "SO3": "SO3",
    "H2O": "H2O",
}

_HYDRATE_DOT_CLEAN_RE = re.compile(r"[\.·•*·\u00B7\u2022\u00b7]\s*\d*\.?\d*\s*H2O\b", re.IGNORECASE)


def clean_formula_text(text: str) -> str:
    """Safe formatting normalization applied to any formula string.
    Does not attempt extraction or abbreviation resolution - just formatting cleanup.
    """
    if not text:
        return ""
    text = text.strip()
    text = unicodedata.normalize("NFKC", text)
    text = text.translate(_UNICODE_DIGIT_TRANSLATION)
    text = _STATE_ANNOTATION_RE.sub("", text)
    text = _HYDRATE_DOT_CLEAN_RE.sub("", text).strip()
    text = _HYDRATE_SEPARATOR_RE.sub(".", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _fictitious_elements(comp) -> List[str]:
    """Return the element symbols in `comp` that are NOT real chemical elements.

    pymatgen is permissive: rather than raising on a nonsense symbol it invents
    a placeholder. ``Composition("NACL")`` yields N + A0+ + C + L0+ (aluminium
    carbon nitride) and ``Composition("Zz9")`` yields a fictitious ``Zz0+``.
    Accepting those turns a typo into a confidently wrong compound, so they must
    be rejected.

    The test is ``isinstance(el, Element)``, NOT ``el.Z > 0``. A DummySpecies
    sets ``Z = hash(symbol)``, and Python randomises string hashing per process,
    so the placeholder's Z is positive in some runs and negative in others -
    a Z-based check would let junk through intermittently. Type identity is
    stable.
    """
    from pymatgen.core.periodic_table import Element

    return [str(el) for el in comp.elements if not isinstance(el, Element)]


def _try_parse(formula: str) -> bool:
    """Return True if pymatgen parses this string AND every element is real.

    The fictitious-element guard is the important half. Without it "NACL"
    parses successfully into N/Ac/L placeholders and the pipeline confidently
    treats aluminium carbon nitride as the user's intended sodium chloride.
    """
    if not formula:
        return False
    try:
        comp = Composition(formula)
    except Exception:
        return False
    if len(comp) == 0:
        return False
    if _fictitious_elements(comp):
        return False
    return True


def extract_formula_candidates(text: str) -> List[str]:
    """Pull out formula-shaped substrings from a sentence, longest first.
    e.g. 'LaMnO3 doped with 30% Sr' -> ['LaMnO3']
    """
    matches = [m.group(0) for m in _FORMULA_TOKEN_RUN_RE.finditer(text)]
    return sorted(set(matches), key=len, reverse=True)


def resolve_x_notation(text: str) -> Optional[str]:
    """Resolve 'A1-xBx..., x=value' into a decimal formula.
    e.g. 'La1-xSrxMnO3, x=0.3' -> 'La0.7Sr0.3MnO3'
    """
    pattern_match = _X_NOTATION_PATTERN_RE.search(text)
    value_match = _X_VALUE_RE.search(text)
    if not pattern_match or not value_match:
        return None

    try:
        x = float(value_match.group("value"))
    except ValueError:
        return None
    if not (0.0 < x < 1.0):
        return None

    host = pattern_match.group("host")
    dopant = pattern_match.group("dopant")
    host_frac = round(1.0 - x, 6)

    replaced = _X_NOTATION_PATTERN_RE.sub(
        f"{host}{host_frac:g}{dopant}{x:g}", text, count=1
    )
    replaced = _X_VALUE_RE.sub("", replaced)
    replaced = re.sub(r"\bwith\b", "", replaced, flags=re.IGNORECASE)
    replaced = re.sub(r",\s*$", "", replaced).strip().rstrip(",").strip()
    replaced = re.sub(r"\s+", "", replaced)
    return replaced if _try_parse(replaced) else None


def lookup_abbreviation(text: str) -> Optional[str]:
    """Check known abbreviations (LSMO, YIG, PZT ...) case-insensitively."""
    key = text.strip().upper()
    return COMMON_ABBREVIATIONS.get(key)


def lookup_common_name(text: str) -> Optional[str]:
    """Resolve a mineral / common / trade name ("hematite", "table salt").

    Tries the whole phrase first, then progressively shorter leading words, so
    both "yttrium iron garnet" and "iron garnet" resolve. Returns None if the
    text does not name a known substance - the caller then falls through to the
    other recognition strategies rather than guessing.
    """
    key = re.sub(r"\s+", " ", text.strip().lower())
    if not key:
        return None
    words = key.split(" ")
    # Longest match wins: try the full phrase, then drop trailing words.
    for start in range(len(words)):
        for end in range(len(words), start, -1):
            phrase = " ".join(words[start:end])
            if phrase in COMMON_NAMES:
                return COMMON_NAMES[phrase]
    return None


def _try_case_normalization(text: str) -> Optional[str]:
    """Attempt case reconstruction for lowercase inputs (e.g. limno4 -> LiMnO4)."""
    try:
        from .classify import _try_normalize_case
        cand = _try_normalize_case(text)
        if cand != text and _try_parse(cand):
            return cand
    except Exception:
        pass
    return None


def recognize_compound_formula(
    raw_input: str,
    ask_user: Optional[AskUserFn] = None,
) -> RecognitionResult:
    """Main entry point for Stage 0 (Compound Recognition).
    Tries in order of specificity:
      1. Direct parse
      2. Cleaned parse (Unicode digits, hydrates, state annotations)
      3. Resolution of '1-x / x=' algebraic notation
      4. Extraction of formula substring from conversational sentences
      5. Abbreviation lookup (LSMO, YBCO, etc.)
      6. Intelligent case-normalization (e.g. limno4 -> LiMnO4)
      7. Ask user for correction if interactive callback is provided
    """
    raw_input = (raw_input or "").strip()
    warnings: List[str] = []

    if not raw_input:
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input="",
            resolved_formula=None,
            method="failed",
            success=False,
            warnings=["empty input provided"],
        )

    # 0. Explicit molecular mapping table (F8: prevents 'co2' from becoming cobalt dimer 'Co2')
    upper_key = raw_input.strip().upper()
    if upper_key in EXPLICIT_MOLECULAR_MAPPINGS:
        canonical = EXPLICIT_MOLECULAR_MAPPINGS[upper_key]
        if raw_input.strip() == canonical:
            return RecognitionResult(
                raw_input=raw_input,
                cleaned_input=raw_input,
                resolved_formula=canonical,
                method="direct",
                success=True,
                warnings=warnings,
            )
        else:
            warnings.append(f"resolved via explicit molecular mapping table: '{raw_input}' -> '{canonical}'")
            return RecognitionResult(
                raw_input=raw_input,
                cleaned_input=raw_input,
                resolved_formula=canonical,
                method="explicit_molecular_mapping",
                success=True,
                warnings=warnings,
            )

    # 1. Abbreviation lookup (checked FIRST so abbreviations like LSMO, YBCO aren't misparsed as dummy elements)
    abbrev_resolved = lookup_abbreviation(raw_input)
    if abbrev_resolved and _try_parse(abbrev_resolved):
        warnings.append(f"resolved abbreviation '{raw_input}' to '{abbrev_resolved}'")
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input=raw_input,
            resolved_formula=abbrev_resolved,
            method="abbreviation",
            success=True,
            warnings=warnings,
        )

    # 1b. ALL-CAPS input is ambiguous and must be case-normalized BEFORE the
    # direct parse is trusted. pymatgen parses "NACL" as N + Ac + L placeholders
    # (aluminium carbon nitride) and "FE2O3" as F + E + O, both of which pass a
    # naive validity test. Trying the normalized spelling first means an
    # unambiguous reading always wins over a coincidentally-parseable wrong one.
    letters = re.sub(r"[^A-Za-z]", "", raw_input)
    is_all_caps = bool(letters) and letters.isupper()
    if is_all_caps:
        caps_resolved = _try_case_normalization(raw_input)
        if caps_resolved and caps_resolved != raw_input and _try_parse(caps_resolved):
            warnings.append(
                f"input is all-caps and ambiguous; case-normalized "
                f"'{raw_input}' to '{caps_resolved}'")
            return RecognitionResult(
                raw_input=raw_input,
                cleaned_input=raw_input,
                resolved_formula=caps_resolved,
                method="case_normalized",
                success=True,
                warnings=warnings,
            )

    # 2. Mineral / common name lookup, BEFORE the direct parse.
    # "hematite" and "table salt" contain no formula-shaped substring, so the
    # extraction step further down can never rescue them; and "rutile" alone
    # would otherwise fail entirely. A name is an unambiguous statement of
    # intent, so it outranks guessing from character patterns.
    name_resolved = lookup_common_name(raw_input)
    if name_resolved and _try_parse(name_resolved):
        warnings.append(f"resolved common name '{raw_input}' to '{name_resolved}'")
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input=raw_input,
            resolved_formula=name_resolved,
            method="common_name",
            success=True,
            warnings=warnings,
        )

    # 3. Direct parse
    if _try_parse(raw_input):
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input=raw_input,
            resolved_formula=raw_input,
            method="direct",
            success=True,
            warnings=warnings,
        )
    warnings.append(f"direct parse of '{raw_input}' failed")

    # 3. Cleaned parse
    cleaned = clean_formula_text(raw_input)
    # Check abbreviation again on cleaned input
    abbrev_cleaned = lookup_abbreviation(cleaned)
    if abbrev_cleaned and _try_parse(abbrev_cleaned):
        warnings.append(f"resolved cleaned abbreviation '{cleaned}' to '{abbrev_cleaned}'")
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input=cleaned,
            resolved_formula=abbrev_cleaned,
            method="abbreviation",
            success=True,
            warnings=warnings,
        )

    if cleaned != raw_input and _try_parse(cleaned):
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input=cleaned,
            resolved_formula=cleaned,
            method="cleaned",
            success=True,
            warnings=warnings,
        )
    if cleaned != raw_input:
        warnings.append(f"cleaned parse of '{cleaned}' failed")

    # 4. "1-x / x=" algebraic notation
    x_resolved = resolve_x_notation(cleaned)
    if x_resolved:
        warnings.append(f"resolved algebraic doping notation to '{x_resolved}'")
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input=cleaned,
            resolved_formula=x_resolved,
            method="x_notation",
            success=True,
            warnings=warnings,
        )

    # 4. Extract formula substring from conversational sentence
    candidates = extract_formula_candidates(cleaned)
    for candidate in candidates:
        if _try_parse(candidate):
            warnings.append(f"extracted formula substring '{candidate}' from input sentence")
            return RecognitionResult(
                raw_input=raw_input,
                cleaned_input=cleaned,
                resolved_formula=candidate,
                method="extracted",
                success=True,
                warnings=warnings,
            )
    if candidates:
        warnings.append(f"extracted candidate(s) {candidates} did not parse")

    # 6. Intelligent case-normalization
    case_cand = _try_case_normalization(cleaned)
    if case_cand:
        warnings.append(f"case-normalized '{cleaned}' to periodic table formula '{case_cand}'")
        return RecognitionResult(
            raw_input=raw_input,
            cleaned_input=cleaned,
            resolved_formula=case_cand,
            method="case_normalized",
            success=True,
            warnings=warnings,
        )

    # 7. Ask user if interactive callback is available
    if ask_user:
        best_guess = candidates[0] if candidates else cleaned
        suggestion_note = f" (best guess: '{best_guess}')" if best_guess else ""
        correction = ask_user(
            f"Could not recognize '{raw_input}' as a chemical formula{suggestion_note}. "
            f"Please provide the correct chemical formula.",
            None,
        )
        if correction and _try_parse(correction):
            warnings.append(f"user corrected input to '{correction}'")
            return RecognitionResult(
                raw_input=raw_input,
                cleaned_input=cleaned,
                resolved_formula=correction,
                method="user_corrected",
                success=True,
                warnings=warnings,
            )

    warnings.append("recognition exhausted all methods without resolving a valid formula")
    return RecognitionResult(
        raw_input=raw_input,
        cleaned_input=cleaned,
        resolved_formula=None,
        method="failed",
        success=False,
        warnings=warnings,
    )
