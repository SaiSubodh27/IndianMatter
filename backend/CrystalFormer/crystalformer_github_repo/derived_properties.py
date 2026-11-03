"""
derived_properties.py -- pure-Python formulas (no torch / no GPU needed) for the three properties that are
calculated from CrystalFormer's four predicted properties.

Inputs (all come from the model, except the volume which comes from the CIF):
    K  = bulk modulus   [GPa]          G  = shear modulus [GPa]
    Eg = band gap       [eV]           V0 = cell volume / number of atoms [Angstrom^3 per atom]

1) Young's modulus (isotropic polycrystal, exact relation):
       E = 9 K G / (3 K + G)                                                          [GPa]

2) Fracture toughness (Niu, Niu & Oganov, J. Appl. Phys. 125, 065105 (2019); also quoted in
   Mazhnik & Oganov, J. Appl. Phys. 126, 125109 (2019) for insulators / semiconductors):
       K_IC = V0^(1/6) * G * sqrt(K / G)          with V0 in Angstrom^3/atom, G and K in GPa
   The product comes out in GPa*Angstrom^(1/2); 1 GPa*Angstrom^(1/2) = 1e3 MPa * (1e-10 m)^(1/2) = 0.01 MPa*m^(1/2),
   so   K_IC [MPa*m^(1/2)] = 0.01 * V0^(1/6) * G * sqrt(K / G).
   Intended for covalent / ionic crystals (i.e. electrolytes). For metals and intermetallics it is less reliable.

3) Electronic conductivity (intrinsic-semiconductor estimate, the same convention as your reference table):
       sigma = sigma0 * exp( -Eg / (2 kB T) )      sigma0 = 1e4 S/cm, T = 300 K, kB = 8.617333e-5 eV/K
   clipped to [1e-16, 1e4] S/cm; Eg <= 0 (metal) gives sigma0. This is a rough indicator only: real electronic
   conductivity depends on defects, doping, effective masses and mobilities. For gaps above about 2.4 eV the
   result simply sits on the 1e-16 S/cm floor.

Run `python derived_properties.py` to execute the built-in self-test.
"""
import math

NAN = float("nan")
KB_EV_PER_K = 8.617333262e-5
T_KELVIN = 300.0
SIGMA0_S_PER_CM = 1.0e4
SIGMA_FLOOR_S_PER_CM = 1.0e-16
GPA_ANGSTROM_HALF_TO_MPA_M_HALF = 0.01


def _ok(*xs):
    return all(x is not None and not math.isnan(x) for x in xs)


def youngs_modulus_GPa(bulk_GPa, shear_GPa):
    if not _ok(bulk_GPa, shear_GPa) or bulk_GPa <= 0 or shear_GPa <= 0:
        return NAN
    return 9.0 * bulk_GPa * shear_GPa / (3.0 * bulk_GPa + shear_GPa)


def fracture_toughness_MPa_m05(bulk_GPa, shear_GPa, volume_per_atom_A3):
    if not _ok(bulk_GPa, shear_GPa, volume_per_atom_A3) or min(bulk_GPa, shear_GPa, volume_per_atom_A3) <= 0:
        return NAN
    return (GPA_ANGSTROM_HALF_TO_MPA_M_HALF * volume_per_atom_A3 ** (1.0 / 6.0)
            * shear_GPa * math.sqrt(bulk_GPa / shear_GPa))


def electronic_conductivity_S_cm(gap_eV, T=T_KELVIN, sigma0=SIGMA0_S_PER_CM, floor=SIGMA_FLOOR_S_PER_CM):
    if not _ok(gap_eV):
        return NAN
    if gap_eV <= 0:
        return sigma0
    return min(sigma0, max(floor, sigma0 * math.exp(-gap_eV / (2.0 * KB_EV_PER_K * T))))


def derive_properties(bulk_GPa, shear_GPa, gap_eV, volume_per_atom_A3):
    """The three extra output columns, in the order they appear in predictions.csv."""
    return dict(
        youngs_modulus_GPa=youngs_modulus_GPa(bulk_GPa, shear_GPa),
        fracture_toughness_MPa_m05=fracture_toughness_MPa_m05(bulk_GPa, shear_GPa, volume_per_atom_A3),
        electronic_conductivity_S_cm=electronic_conductivity_S_cm(gap_eV),
    )


def _selftest():
    def close(a, b, tol):
        return abs(a - b) <= tol * abs(b)
    checks = []
    checks.append(("E(K=100,G=40) = 105.88", close(youngs_modulus_GPa(100, 40), 9 * 100 * 40 / 340, 1e-12)))
    checks.append(("E(K=78.6,G=68.5) ~ 159.2 (Li2O, Materials Project values)", close(youngs_modulus_GPa(78.6, 68.5), 159.2, 0.005)))
    checks.append(("E rejects bad input", math.isnan(youngs_modulus_GPa(float('nan'), 40)) and math.isnan(youngs_modulus_GPa(-1, 40))))
    kic = fracture_toughness_MPa_m05(443, 535, 5.673)       # diamond; the Mazhnik-Oganov paper quotes ~6.4 MPa m^1/2
    checks.append((f"K_IC(diamond-like inputs) = {kic:.2f}, expected 6-7", 6.0 < kic < 7.0))
    checks.append(("K_IC scales as V0^(1/6)", close(fracture_toughness_MPa_m05(100, 40, 64.0) / fracture_toughness_MPa_m05(100, 40, 1.0), 2.0, 1e-9)))
    checks.append(("sigma(Eg=0) = 1e4", electronic_conductivity_S_cm(0.0) == 1.0e4))
    checks.append(("sigma(Eg=0.5) follows the formula", close(electronic_conductivity_S_cm(0.5), 1e4 * math.exp(-0.5 / (2 * KB_EV_PER_K * 300)), 1e-12)))
    checks.append(("sigma floor 1e-16 for Eg=5", electronic_conductivity_S_cm(5.0) == 1.0e-16))
    checks.append(("sigma(Eg=nan) = nan", math.isnan(electronic_conductivity_S_cm(float('nan')))))
    bad = 0
    for name, ok in checks:
        print(("PASS  " if ok else "FAIL  ") + name)
        bad += (not ok)
    print("SELFTEST", "PASSED" if bad == 0 else f"FAILED ({bad})")
    raise SystemExit(1 if bad else 0)


if __name__ == "__main__":
    _selftest()
