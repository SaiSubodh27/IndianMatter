import math
from typing import Any, Optional
from properties.base_property import BasePropertyCalculator, PropertyResult
from calculations.strain_response import run_strain_response_calculation

class DebyeTemperatureCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="debye_temperature",
            name="Debye Temperature",
            category="thermal",
            unit="K",
            description="Estimated Debye temperature derived from elastic moduli and sound velocities (Anderson formula)."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        if model_adapter is None:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
                status="failed", warnings=["Atomistic model adapter is required for elastic strain evaluation."]
            )

        ctx = settings or {}
        mech_res = ctx.get("precomputed_strain_response")
        if not mech_res:
            mech_res = run_strain_response_calculation(model_adapter, structure, ctx.get("strain_settings"))

        if mech_res.get("status") == "failed":
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model=model_adapter.display_name,
                calculation_method="anderson_elastic_sound_velocity", status="failed",
                warnings=["Mechanical strain calculation failed; Debye temperature unavailable."]
            )

        k_vrh = mech_res.get("bulk_modulus_gpa", 0.0)  # GPa
        g_vrh = mech_res.get("shear_modulus_gpa", 0.0) # GPa
        density = float(structure.density) * 1000.0   # kg/m^3

        if k_vrh <= 0 or g_vrh <= 0 or density <= 0:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model=model_adapter.display_name,
                calculation_method="anderson_elastic_sound_velocity", status="invalid",
                warnings=["Non-positive moduli or density preclude Debye temperature estimation."]
            )

        # Sound velocities (m/s)
        # v_l = sqrt((K + 4/3*G) / density), v_s = sqrt(G / density)
        # K, G in Pa
        k_pa = k_vrh * 1e9
        g_pa = g_vrh * 1e9
        v_l = math.sqrt((k_pa + 4.0/3.0 * g_pa) / density)
        v_s = math.sqrt(g_pa / density)

        # Average sound velocity v_m
        v_m = (1.0/3.0 * (2.0 / (v_s**3) + 1.0 / (v_l**3))) ** (-1.0/3.0)

        # Debye temperature theta_D = (h/k_B) * (3*n*N_A / (4*pi*V))^(1/3) * v_m
        h = 6.62607015e-34
        k_b = 1.380649e-23
        n_atoms = len(structure)
        vol_m3 = float(structure.volume) * 1e-30
        
        num_density = n_atoms / vol_m3
        theta_d = (h / k_b) * ((3.0 * num_density / (4.0 * math.pi)) ** (1.0/3.0)) * v_m

        return PropertyResult(
            property_key=self.key, property_name=self.name, category=self.category,
            value=round(float(theta_d), 1), unit=self.unit, source_model=model_adapter.display_name,
            calculation_method="anderson_elastic_sound_velocity", status="derived",
            inputs_used=["bulk_modulus", "shear_modulus", "density", "number_density"],
            warnings=["Debye temperature is an isotropic elastic estimate."],
            raw_details={"v_longitudinal_m_s": round(v_l, 1), "v_transverse_m_s": round(v_s, 1), "v_mean_m_s": round(v_m, 1)}
        )

class ThermalConductivityCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="thermal_conductivity",
            name="Thermal Conductivity",
            category="thermal",
            unit="W/(m*K)",
            description="Phonon lattice thermal conductivity (Requires explicit lattice dynamics or MD)."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        return PropertyResult(
            property_key=self.key, property_name=self.name, category=self.category,
            value=None, unit=self.unit, source_model=model_adapter.display_name if model_adapter else "N/A",
            calculation_method="unsupported_direct_evaluation", status="unavailable",
            inputs_used=[],
            warnings=[
                "Thermal conductivity cannot be directly calculated from M3GNet, CHGNet, or MACE without full phonon Boltzmann Transport Equation (BTE) or Molecular Dynamics (MD) simulations."
            ],
            limitations="Lattice thermal conductivity requires second- and third-order force constants not computed in single-point or strain evaluations."
        )
