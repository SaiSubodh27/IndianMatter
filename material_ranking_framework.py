"""
═══════════════════════════════════════════════════════════════════════════════
PHYSICS-INFORMED MATERIAL RANKING FRAMEWORK
For Lithium-Ion Solid-State Electrolyte Screening

Core Components:
- Physics-based descriptors (tEF, tFI, structural metrics)
- State-based framework (Transport, Stability, Frustration states)
- Non-linear interaction model
- Synthesizability assessment
- Final composite ranking (0–100)

Author: AI Physics-ML Integration
Version: 1.0
═══════════════════════════════════════════════════════════════════════════════
"""

import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional, Any
from dataclasses import dataclass, asdict, field
from pathlib import Path
import warnings

# Physical constants
K_B = 8.617e-5  # Boltzmann constant (eV/K)
F_CONST = 96485.3  # Faraday constant (C/mol)
TEMPERATURE_DEFAULT = 300  # K


@dataclass
class StructuralMetrics:
    """Crystal structure properties from CIF/CHGNet."""
    volume_initial: float  # Å³
    volume_final: Optional[float] = None  # After relaxation
    density: float = 0.0  # g/cm³
    space_group: Optional[str] = None
    
    @property
    def volume_change(self) -> float:
        """ΔV = (V_final - V_initial) / V_initial"""
        if self.volume_final is None:
            return 0.0
        return (self.volume_final - self.volume_initial) / self.volume_initial
    
    @property
    def is_stable(self, threshold: float = 0.1) -> bool:
        """Estimate stability from volume change."""
        dv = abs(self.volume_change)
        return dv < threshold  # Arbitrary threshold; refine with ML


@dataclass
class ThermodynamicProperties:
    """Formation energy and hull data."""
    formation_energy: float  # eV/atom
    energy_above_hull: float  # eV/atom (E_compound - E_hull)
    magnetic_moment: float = 0.0  # μ_B/atom (proxy for charge distribution)
    
    def feasibility_thermo(self, T: float = TEMPERATURE_DEFAULT) -> float:
        """
        Thermodynamic feasibility.
        Feasibility_T = exp(−E_hull / kT)
        
        Higher → more thermodynamically stable → easier synthesis
        """
        if self.energy_above_hull <= 0:
            return 1.0
        exponent = -self.energy_above_hull / (K_B * T)
        return np.exp(np.clip(exponent, -10, 10))


@dataclass
class TransportProperties:
    """Ion transport metrics."""
    ionic_conductivity: float  # S/cm (σ)
    migration_barrier: float  # eV (E_a)
    pre_exponential_factor: float = 1e13  # s⁻¹ (D_0)
    
    @property
    def conductivity_arrhenius(self, T: float = TEMPERATURE_DEFAULT) -> float:
        """Predict σ from Arrhenius: σ = σ0 × exp(−E_a / kT)"""
        return self.pre_exponential_factor * np.exp(
            -self.migration_barrier / (K_B * T)
        )
    
    @property
    def activation_energy_relative(self) -> float:
        """Normalize E_a to typical Li migration (0.3 eV)."""
        baseline = 0.3
        return self.migration_barrier / baseline


@dataclass
class MechanicalProperties:
    """Structural robustness."""
    bulk_modulus: float = 0.0  # GPa
    shear_modulus: float = 0.0  # GPa
    hardness: float = 0.0  # GPa (optional)
    
    @property
    def elastic_rigidity_factor(self) -> float:
        """Composite stiffness metric: (K + G/3) / 100 [0–1]"""
        return np.clip((self.bulk_modulus + self.shear_modulus / 3) / 100, 0, 1)


@dataclass
class MaterialProperties:
    """Complete material state."""
    material_id: str
    composition: str
    structural: StructuralMetrics
    thermodynamic: ThermodynamicProperties
    transport: TransportProperties
    mechanical: Optional[MechanicalProperties] = None
    disorder_metric: float = 0.0  # 0–1 (structural disorder proxy)
    
    def to_dict(self) -> Dict:
        """Convert to flat dictionary for serialization."""
        d = {
            'material_id': self.material_id,
            'composition': self.composition,
            'disorder_metric': self.disorder_metric,
        }
        d.update({f'struct_{k}': v for k, v in asdict(self.structural).items()})
        d.update({f'thermo_{k}': v for k, v in asdict(self.thermodynamic).items()})
        d.update({f'trans_{k}': v for k, v in asdict(self.transport).items()})
        if self.mechanical:
            d.update({f'mech_{k}': v for k, v in asdict(self.mechanical).items()})
        return d


# ════════════════════════════════════════════════════════════════════════════
# PHYSICS-BASED DESCRIPTORS
# ════════════════════════════════════════════════════════════════════════════

class PhysicsDescriptors:
    """
    Novel transport descriptors:
    1. Transport Efficiency Factor (tEF)
    2. Transport Frustration Index (tFI)
    3. Structural disorder proxy
    """
    
    @staticmethod
    def transport_efficiency_factor(
        sigma: float,
        E_a: float,
        baseline_Ea: float = 0.3,
    ) -> float:
        """
        tEF = σ / (E_a / E_a_baseline)
        
        Interpretation: high conductivity + low barrier = high tEF
        Range: [0, ∞] → normalize to [0, 1]
        """
        if E_a <= 0:
            return 0.0
        
        E_a_norm = E_a / baseline_Ea
        # Avoid division by zero
        tef = sigma / E_a_norm if E_a_norm > 0 else 0.0
        
        # Normalize to [0, 1] using sigmoid-like scaling
        # Assume max realistic tEF ~0.1 S·cm⁻¹ / barrier_unit
        return np.tanh(tef / 0.1)
    
    @staticmethod
    def transport_frustration_index(
        disorder_metric: float,
        connectivity_variation: float = 0.1,
    ) -> float:
        """
        tFI = local_disorder / mean_connectivity
        
        Proxy for irregular diffusion paths.
        High tFI → worse transport (more frustration)
        
        Range: [0, 1]
        """
        # Combine structural disorder + coordination variation
        # This is intentionally simplified; extend with NEB path analysis
        return np.clip(disorder_metric + connectivity_variation, 0, 1)
    
    @staticmethod
    def structural_disorder_proxy(
        volume_change: float,
        magnetic_moment: float,
        space_group_number: Optional[int] = None,
    ) -> float:
        """
        Disorder proxy combining:
        - Volume change (relaxation-induced distortion)
        - Magnetic moment (electron localization)
        - Crystal symmetry (via space group)
        
        Returns [0, 1]: 0=high symmetry/low disorder, 1=high disorder
        """
        # Volume change contribution (|ΔV| → disorder)
        disorder_v = np.tanh(abs(volume_change) * 5)  # scale factor
        
        # Magnetic moment contribution (high μ → localization → disorder)
        disorder_m = np.tanh(abs(magnetic_moment) / 2.0)
        
        # Symmetry contribution (lower space group number → higher symmetry)
        disorder_sym = 0.0
        if space_group_number is not None:
            disorder_sym = 1.0 - (space_group_number / 230.0)  # Normalize to [0,1]
        
        return np.mean([disorder_v, disorder_m, disorder_sym])


# ════════════════════════════════════════════════════════════════════════════
# STATE-BASED FRAMEWORK: T, S, F
# ════════════════════════════════════════════════════════════════════════════

@dataclass
class MaterialStates:
    """Three interacting physical states."""
    T: float  # Transport State [0, 1]
    S: float  # Stability State [0, 1]
    F: float  # Frustration State [0, 1]


class StateBuilder:
    """Construct material states from properties."""
    
    @staticmethod
    def transport_state(
        sigma: float,
        E_a: float,
        tef: float,
        pre_exponential: float = 1e13,  # Pre-exponential factor (s⁻¹) 
        sigma_ref: float = 0.001,  # Reference conductivity (S/cm)
        Ea_ref: float = 0.3,  # Reference barrier (eV)
        pre_exp_ref: float = 1e13,  # Reference pre-exponential (s⁻¹)
        temperature_k: float = 300.0,  # Temperature (K)
    ) -> float:
        """
        Transport State T:
        T = f(σ, E_a, pre_exponential, tEF)
        
        Formula (incorporating both EA and pre-exponential factor):
        T = [σ / σ_ref] × [A / A_ref]^0.3 × exp(−E_a / E_a_ref) × (1 + tEF)
        
        Where:
        - σ: measured/predicted ionic conductivity
        - A: pre-exponential factor from Arrhenius equation
        - E_a: activation energy for ion migration
        - tEF: topological energy frustration
        
        Normalized to [0, 1]
        """
        # Conductivity contribution (higher → higher T)
        contrib_sigma = np.tanh(sigma / sigma_ref)
        
        # Pre-exponential factor contribution (higher → higher T)
        # Higher pre-exponential factor indicates higher attempt frequency
        contrib_preexp = np.tanh(np.log10(pre_exponential / pre_exp_ref))
        
        # Barrier contribution (lower → higher T)
        contrib_Ea = np.exp(-E_a / Ea_ref)
        
        # tEF contribution
        contrib_tef = 1.0 + tef
        
        # Combined: all contributions multiply (synergistic effect)
        T_raw = contrib_sigma * (1.0 + 0.3 * contrib_preexp) * contrib_Ea * contrib_tef
        
        # Normalize to [0, 1]
        return np.tanh(T_raw)
    
    @staticmethod
    def stability_state(
        E_above_hull: float,
        volume_change: float,
        bulk_modulus: float = 50,  # GPa (typical ceramic)
        Ea_threshold: float = 0.5,  # eV
    ) -> float:
        """
        Stability State S:
        S = f(E_hull, ΔV, K_bulk)
        
        Formula:
        S = exp(−E_hull / E_threshold) × exp(−|ΔV|) × K_bulk / 100
        Normalized to [0, 1]
        """
        # Thermodynamic stability
        contrib_hull = np.exp(-np.clip(E_above_hull, 0, 1.0) / Ea_threshold)
        
        # Structural stability (volume change)
        contrib_dv = np.exp(-abs(volume_change))
        
        # Mechanical stiffness
        contrib_K = bulk_modulus / 100.0
        
        S_raw = contrib_hull * contrib_dv * contrib_K
        
        return np.clip(S_raw, 0, 1)
    
    @staticmethod
    def frustration_state(
        tfi: float,
        disorder: float,
        path_complexity: float = 0.3,
    ) -> float:
        """
        Frustration State F:
        F = f(tFI, disorder_metrics, diffusion_complexity)
        
        HIGH F → bad (irregular paths)
        LOW F → good (smooth transport)
        
        Formula:
        F = (tFI + disorder + path_complexity) / 3
        Already in [0, 1]
        """
        F = np.mean([tfi, disorder, path_complexity])
        return np.clip(F, 0, 1)


# ════════════════════════════════════════════════════════════════════════════
# IONIC CONDUCTIVITY CALCULATION WITH BOTH EA AND PRE-EXPONENTIAL FACTOR
# ════════════════════════════════════════════════════════════════════════════

class IonicConductivityCalculator:
    """
    Calculate ionic conductivity using Arrhenius equation with both 
    activation energy (EA) and pre-exponential factor.
    
    σ = A × exp(-E_a / kT)
    
    Where:
    - σ: ionic conductivity (S/cm)
    - A: pre-exponential factor (attempt frequency, s⁻¹)
    - E_a: activation energy (eV)
    - k: Boltzmann constant (eV/K)
    - T: temperature (K)
    """
    
    @staticmethod
    def calculate_conductivity(
        pre_exponential: float,
        activation_energy_ev: float,
        temperature_k: float = TEMPERATURE_DEFAULT,
    ) -> float:
        """
        Calculate ionic conductivity from pre-exponential factor and EA.
        
        Note: For solid-state electrolytes, the pre-exponential factor is typically
        expressed as a coefficient in the conductivity formula, not literally s⁻¹.
        The units are implicit in how the model was trained.
        
        Args:
            pre_exponential: Pre-exponential factor (dimensionless coefficient)
            activation_energy_ev: Activation energy (eV)
            temperature_k: Temperature (K, default 300K)
            
        Returns:
            Ionic conductivity in S/cm
        """
        exponent = -activation_energy_ev / (K_B * temperature_k)
        # Clip to prevent overflow/underflow
        exponent = np.clip(exponent, -100, 10)
        sigma = pre_exponential * np.exp(exponent)
        # Don't clip - let physical constraints emerge naturally
        return np.clip(sigma, 1e-15, 1e5)  # Extended realistic range
    
    @staticmethod
    def calculate_conductivity_log10(
        log10_pre_exponential: float,
        activation_energy_ev: float,
        temperature_k: float = TEMPERATURE_DEFAULT,
    ) -> float:
        """
        Calculate log10(ionic conductivity) from log10(pre-exponential) and EA.
        
        Args:
            log10_pre_exponential: log10 of pre-exponential factor
            activation_energy_ev: Activation energy (eV)
            temperature_k: Temperature (K, default 300K)
            
        Returns:
            log10(ionic conductivity in S/cm)
        """
        pre_exp = 10.0 ** log10_pre_exponential
        sigma = IonicConductivityCalculator.calculate_conductivity(
            pre_exp, activation_energy_ev, temperature_k
        )
        return np.log10(sigma) if sigma > 0 else -100.0
    
    @staticmethod
    def extract_pre_exponential_from_conductivity(
        conductivity_s_cm: float,
        activation_energy_ev: float,
        temperature_k: float = TEMPERATURE_DEFAULT,
    ) -> float:
        """
        Back-calculate pre-exponential factor from known conductivity and EA.
        Useful for validating measurements.
        
        Args:
            conductivity_s_cm: Measured ionic conductivity (S/cm)
            activation_energy_ev: Activation energy (eV)
            temperature_k: Temperature (K, default 300K)
            
        Returns:
            Implied pre-exponential factor (s⁻¹)
        """
        exponent = -activation_energy_ev / (K_B * temperature_k)
        pre_exp = conductivity_s_cm / np.exp(exponent)
        return np.clip(pre_exp, 1e0, 1e20)  # Physically reasonable
    
    @staticmethod
    def conductivity_score(
        conductivity_s_cm: float,
        conductivity_ref: float = 0.001,  # Reference for solid electrolytes
        min_target: float = 1e-3,  # Minimum acceptable (S/cm)
    ) -> float:
        """
        Score ionic conductivity on [0, 1] scale.
        Higher conductivity → higher score.
        
        Args:
            conductivity_s_cm: Calculated or measured conductivity
            conductivity_ref: Reference value for normalization
            min_target: Minimum acceptable conductivity
            
        Returns:
            Score in [0, 1]
        """
        if conductivity_s_cm < min_target:
            return 0.0
        
        # Use tanh for smooth saturation
        score = np.tanh(conductivity_s_cm / conductivity_ref)
        return np.clip(score, 0, 1)
    
    @staticmethod
    def arrhenius_consistency_check(
        measured_conductivity: float,
        pre_exponential: float,
        activation_energy_ev: float,
        temperature_k: float = TEMPERATURE_DEFAULT,
        tolerance: float = 0.3,  # 30% tolerance
    ) -> Dict[str, Any]:
        """
        Check if measured conductivity is consistent with Arrhenius parameters.
        
        Args:
            measured_conductivity: Measured ionic conductivity (S/cm)
            pre_exponential: Pre-exponential factor (s⁻¹)
            activation_energy_ev: Activation energy (eV)
            temperature_k: Temperature (K)
            tolerance: Fractional tolerance for consistency (0.3 = 30%)
            
        Returns:
            Dictionary with consistency check results
        """
        predicted = IonicConductivityCalculator.calculate_conductivity(
            pre_exponential, activation_energy_ev, temperature_k
        )
        
        if measured_conductivity <= 0 or predicted <= 0:
            return {
                "consistent": False,
                "reason": "Non-positive conductivity values",
                "measured": measured_conductivity,
                "predicted": predicted,
                "relative_error": None,
            }
        
        relative_error = abs(measured_conductivity - predicted) / measured_conductivity
        consistent = relative_error <= tolerance
        
        return {
            "consistent": consistent,
            "reason": "OK" if consistent else f"Error {relative_error:.1%} exceeds {tolerance:.1%}",
            "measured": measured_conductivity,
            "predicted": predicted,
            "relative_error": relative_error,
        }


# ════════════════════════════════════════════════════════════════════════════
# NON-LINEAR INTERACTION MODEL
# ════════════════════════════════════════════════════════════════════════════

@dataclass
class InteractionParameters:
    """Tunable parameters for non-linear scoring."""
    alpha: float = 2.0  # Transport exponent
    beta: float = 1.5  # Stability exponent
    gamma: float = 3.0  # Frustration penalty coefficient
    delta: float = 1.0  # Feasibility exponent
    T_weight: float = 1.0  # Transport scaling
    S_weight: float = 1.0  # Stability scaling


@dataclass
class ConstraintParameters:
    """Physics constraints for rejecting unrealistic candidates."""
    migration_barrier_max: float = 1.0  # eV
    energy_above_hull_max: float = 0.5  # eV/atom
    reject_score: float = 0.0


class InteractionModel:
    """Non-linear state interaction framework."""
    
    @staticmethod
    def composite_score_raw(
        states: MaterialStates,
        params: InteractionParameters = InteractionParameters(),
        feasibility: float = 1.0,
        constraint_penalty: float = 1.0,
        use_penalty: bool = True,
    ) -> float:
        """
        Score_raw = (T^α × S^β) × exp(−γF) × Feasibility^δ × constraints
        
        This captures:
        - Power-law scaling for transport (favorable with exponent α)
        - Power-law scaling for stability (favorable with exponent β)
        - Exponential penalty for frustration (unfavorable)
        
        Returns: [0, ∞] before normalization
        """
        # Transport × Stability interaction
        T_contrib = (states.T ** params.alpha) * params.T_weight
        S_contrib = (states.S ** params.beta) * params.S_weight
        
        ts_product = T_contrib * S_contrib
        
        # Frustration penalty (exponential)
        if use_penalty:
            F_penalty = np.exp(-params.gamma * states.F)
        else:
            F_penalty = 1.0 - states.F  # Linear alternative
        
        feasibility_term = np.clip(feasibility, 0, 1) ** params.delta
        score_raw = ts_product * F_penalty * feasibility_term * constraint_penalty
        
        return score_raw
    
    @staticmethod
    def sensitivity_analysis(
        states: MaterialStates,
        param_ranges: Dict[str, Tuple[float, float]] = None,
    ) -> Dict[str, float]:
        """
        Analyze how score changes with parameter variations.
        Useful for understanding which state dominates ranking.
        
        Returns: sensitivity coefficients for α, β, γ
        """
        if param_ranges is None:
            param_ranges = {
                'alpha': (0.5, 3.0),
                'beta': (0.5, 3.0),
                'gamma': (0.5, 5.0),
            }
        
        base_params = InteractionParameters()
        base_score = InteractionModel.composite_score_raw(states, base_params)
        
        sensitivity = {}
        for param_name, (lo, hi) in param_ranges.items():
            p1 = InteractionParameters(**{param_name: lo})
            p2 = InteractionParameters(**{param_name: hi})
            
            s1 = InteractionModel.composite_score_raw(states, p1)
            s2 = InteractionModel.composite_score_raw(states, p2)
            
            sensitivity[param_name] = abs(s2 - s1) / (base_score + 1e-10)
        
        return sensitivity


# ════════════════════════════════════════════════════════════════════════════
# SYNTHESIZABILITY & FEASIBILITY
# ════════════════════════════════════════════════════════════════════════════

class SynthesizabilityScore:
    """Estimate likelihood of experimental synthesis success."""
    
    @staticmethod
    def feasibility_combined(
        E_above_hull: float,
        volume_change: float,
        T: float = TEMPERATURE_DEFAULT,
        feasibility_thermo: Optional[float] = None,
    ) -> float:
        """
        Feasibility = exp(−E_hull / kT) × exp(−|ΔV|)
        
        Interpretation:
        - Lower E_hull → easier (thermodynamically favorable)
        - Smaller |ΔV| → easier (structurally stable)
        
        Returns [0, 1]: 0=impossible, 1=highly feasible
        """
        if feasibility_thermo is None:
            feasibility_thermo = np.exp(-E_above_hull / (K_B * T))
        
        feasibility_dv = np.exp(-abs(volume_change) * 10)  # scale: larger changes → penalty
        
        feasibility = feasibility_thermo * feasibility_dv
        
        return np.clip(feasibility, 0, 1)
    
    @staticmethod
    def penalty_factors(
        E_above_hull: float,
        E_a: float,
        E_a_max: float = 1.0,  # Max acceptable barrier (eV)
        E_hull_max: float = 0.5,  # Max acceptable hull energy (eV/atom)
    ) -> Tuple[float, float]:
        """
        Hard constraints: penalize unrealistic materials.
        
        Returns:
        - penalty_barrier: 0 if E_a > threshold, else 1
        - penalty_hull: 0 if E_hull > threshold, else 1
        """
        penalty_Ea = 0.0 if E_a > E_a_max else 1.0
        penalty_hull = 0.0 if E_above_hull > E_hull_max else 1.0
        
        return penalty_Ea, penalty_hull


# ════════════════════════════════════════════════════════════════════════════
# FINAL RANKING & NORMALIZATION
# ════════════════════════════════════════════════════════════════════════════

@dataclass
class RankingResult:
    """Complete ranking output for a material."""
    material_id: str
    composition: str
    transport_state: float
    stability_state: float
    frustration_state: float
    transport_efficiency_factor: float
    transport_frustration_index: float
    feasibility: float
    score_raw: float
    score_normalized: float  # 0–100
    rank: int = -1


class MaterialRanker:
    """End-to-end ranking pipeline."""
    
    def __init__(
        self,
        interaction_params: Optional[InteractionParameters] = None,
        constraint_params: Optional[ConstraintParameters] = None,
    ):
        self.params = interaction_params or InteractionParameters()
        self.constraints = constraint_params or ConstraintParameters()
        self.results: list[RankingResult] = []
        self.score_stats: Dict[str, float] = {}
    
    def rank_material(
        self,
        props: MaterialProperties,
    ) -> RankingResult:
        """
        Compute composite ranking for a single material.
        
        Pipeline:
        1. Compute descriptors (tEF, tFI, disorder)
        2. Build states (T, S, F)
        3. Compute feasibility
        4. Apply interaction model
        5. Normalize to 0–100
        """
        # 1. Descriptors
        tef = PhysicsDescriptors.transport_efficiency_factor(
            props.transport.ionic_conductivity,
            props.transport.migration_barrier,
        )
        
        tfi = PhysicsDescriptors.transport_frustration_index(
            props.disorder_metric,
        )
        
        # 2. States
        T = StateBuilder.transport_state(
            props.transport.ionic_conductivity,
            props.transport.migration_barrier,
            tef,
        )
        
        S = StateBuilder.stability_state(
            props.thermodynamic.energy_above_hull,
            props.structural.volume_change,
            props.mechanical.bulk_modulus if props.mechanical else 50.0,
        )
        
        F = StateBuilder.frustration_state(
            tfi,
            props.disorder_metric,
        )
        
        states = MaterialStates(T=T, S=S, F=F)
        
        # 3. Feasibility
        feasibility = SynthesizabilityScore.feasibility_combined(
            props.thermodynamic.energy_above_hull,
            props.structural.volume_change,
        )
        
        penalty_Ea, penalty_hull = SynthesizabilityScore.penalty_factors(
            props.thermodynamic.energy_above_hull,
            props.transport.migration_barrier,
            E_a_max=self.constraints.migration_barrier_max,
            E_hull_max=self.constraints.energy_above_hull_max,
        )
        constraint_penalty = penalty_Ea * penalty_hull
        
        # 4. Raw score
        score_raw = InteractionModel.composite_score_raw(
            states,
            self.params,
            feasibility=feasibility,
            constraint_penalty=constraint_penalty,
        )
        if constraint_penalty == 0.0:
            score_raw = self.constraints.reject_score
        
        # 5. Create result (normalization done globally)
        result = RankingResult(
            material_id=props.material_id,
            composition=props.composition,
            transport_state=T,
            stability_state=S,
            frustration_state=F,
            transport_efficiency_factor=tef,
            transport_frustration_index=tfi,
            feasibility=feasibility,
            score_raw=score_raw,
            score_normalized=score_raw,  # placeholder
        )
        
        self.results.append(result)
        return result
    
    def rank_batch(
        self,
        materials: list[MaterialProperties],
    ) -> pd.DataFrame:
        """
        Rank multiple materials and return normalized scores.
        """
        self.results = []
        self.score_stats = {}
        
        # Compute raw scores
        for mat in materials:
            self.rank_material(mat)
        
        # Normalize all scores to [0, 100]
        if not self.results:
            return pd.DataFrame()
        
        raw_scores = np.array([r.score_raw for r in self.results])
        min_score = raw_scores.min()
        max_score = raw_scores.max()
        
        # Avoid division by zero
        if max_score == min_score:
            range_val = 1.0
        else:
            range_val = max_score - min_score
        
        # Normalize each result
        for result in self.results:
            result.score_normalized = 100.0 * (result.score_raw - min_score) / range_val
        
        # Sort by normalized score (descending)
        self.results.sort(key=lambda r: r.score_normalized, reverse=True)
        
        # Assign ranks
        for i, result in enumerate(self.results, 1):
            result.rank = i
        
        # Store statistics
        self.score_stats = {
            'min': min_score,
            'max': max_score,
            'mean': np.mean(raw_scores),
            'std': np.std(raw_scores),
        }
        
        # Convert to DataFrame
        results_dict = [asdict(r) for r in self.results]
        return pd.DataFrame(results_dict)
    
    def results_to_dataframe(self) -> pd.DataFrame:
        """Export ranking results as DataFrame."""
        if not self.results:
            return pd.DataFrame()
        
        results_dict = [asdict(r) for r in self.results]
        return pd.DataFrame(results_dict)
    
    def summary_statistics(self) -> Dict[str, Any]:
        """Get ranking statistics."""
        if not self.results:
            return {}
        
        df = self.results_to_dataframe()
        
        return {
            'n_materials': len(self.results),
            'score_mean': df['score_normalized'].mean(),
            'score_std': df['score_normalized'].std(),
            'score_min': df['score_normalized'].min(),
            'score_max': df['score_normalized'].max(),
            'transport_state_mean': df['transport_state'].mean(),
            'stability_state_mean': df['stability_state'].mean(),
            'frustration_state_mean': df['frustration_state'].mean(),
            'feasibility_mean': df['feasibility'].mean(),
        }


# ════════════════════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ════════════════════════════════════════════════════════════════════════════

def materials_to_ranking_df(
    materials: list[MaterialProperties],
    interaction_params: Optional[InteractionParameters] = None,
    verbose: bool = True,
) -> Tuple[pd.DataFrame, MaterialRanker]:
    """
    Convenience function: rank list of materials in one call.
    
    Returns:
    - DataFrame with all results
    - MaterialRanker object (for further analysis)
    """
    ranker = MaterialRanker(interaction_params)
    df = ranker.rank_batch(materials)
    
    if verbose:
        print(f"✅ Ranked {len(materials)} materials")
        print(f"   Score range: {ranker.score_stats['min']:.3f} → {ranker.score_stats['max']:.3f}")
        print(f"   Mean score: {ranker.score_stats['mean']:.3f} ± {ranker.score_stats['std']:.3f}")
    
    return df, ranker


if __name__ == '__main__':
    print("Physics-Informed Material Ranking Framework loaded.")
    print("Use: from material_ranking_framework import *")
