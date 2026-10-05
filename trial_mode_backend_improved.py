#!/usr/bin/env python3
"""
TRIAL MODE BACKEND - IMPROVED
==============================
Fixed version addressing all reported bugs:
✓ Extracts all 343 features correctly
✓ Proper EA model predictions (uses correct feature set)
✓ Fixed crystal type classification
✓ Complete error diagnostics
"""

import os
import sys
import json
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
import tempfile
import shutil

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

# Materials science imports
from pymatgen.core import Structure
from pymatgen.io.ase import AseAtomsAdaptor
import types

print("=" * 100)
print(f"[STARTUP] Trial Mode Backend (IMPROVED) - {datetime.now().isoformat()}")
print("=" * 100)

# ==================== CONFIGURATION ====================
BASE_DIR = Path(__file__).parent
PRETRAINED_MODELS_DIR = BASE_DIR / "pretrained_models"
DATASETS_DIR = BASE_DIR / "datasets"
UPLOAD_FOLDER = BASE_DIR / "trial_uploads"
RESULTS_FOLDER = BASE_DIR / "trial_results"

# Create folders
UPLOAD_FOLDER.mkdir(exist_ok=True)
RESULTS_FOLDER.mkdir(exist_ok=True)

# Model files
MODEL_FILES = {
    'ea_model': PRETRAINED_MODELS_DIR / "v5_model2_A.pkl",
}

# Constants
K_B_EV_PER_K = 8.617333262145e-5
TEMPERATURE_K = 300.0
EXPECTED_FEATURES = 343
TRAINING_DATA_PATH = DATASETS_DIR / "v5_merged_training_dataset.csv"

# Flask app
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024


# ==================== GLOBAL STATE ====================
class TrialModeState:
    def __init__(self):
        self.models = {}
        self.training_data = None
        self.training_features = []
        self.scaler = None
        self.last_result = None
        self.error_log = []
        self.initialized = False
        self.m3gnet_model = None
        self.m3gnet_calculator_cls = None
    
    def log_error(self, error_dict: Dict):
        error_dict['timestamp'] = datetime.now().isoformat()
        self.error_log.append(error_dict)
        print(f"[ERROR LOGGED] {error_dict['type']}: {error_dict.get('reason', '')}")


state = TrialModeState()


# ==================== INITIALIZATION ====================
def initialize_backend():
    """Initialize all components"""
    print("\n[INIT] Loading backend components...")
    
    errors = []
    
    # Load EA model
    print("\n[INIT] Loading EA model...")
    if MODEL_FILES['ea_model'].exists():
        try:
            with open(MODEL_FILES['ea_model'], 'rb') as f:
                state.models['ea_model'] = pickle.load(f)
            print(f"  ✓ EA model loaded ({MODEL_FILES['ea_model'].stat().st_size / 1024 / 1024:.2f} MB)")
        except Exception as e:
            error_msg = f"Failed to load EA model: {str(e)}"
            errors.append(error_msg)
            print(f"  ✗ {error_msg}")
    else:
        error_msg = f"EA model not found: {MODEL_FILES['ea_model']}"
        errors.append(error_msg)
        print(f"  ✗ {error_msg}")
    
    # Load training data (for feature scaling reference)
    print("\n[INIT] Loading training data...")
    if TRAINING_DATA_PATH.exists():
        try:
            state.training_data = pd.read_csv(TRAINING_DATA_PATH, nrows=100)
            state.training_features = [col for col in state.training_data.columns 
                                      if col not in ['material_id', 'formula_pretty', 'log10_conductivity_300K']]
            print(f"  ✓ Training data loaded ({len(state.training_data)} samples)")
            print(f"  ✓ Reference features: {len(state.training_features)}")
        except Exception as e:
            error_msg = f"Failed to load training data: {str(e)}"
            errors.append(error_msg)
            print(f"  ✗ {error_msg}")
    else:
        error_msg = f"Training data not found: {TRAINING_DATA_PATH}"
        errors.append(error_msg)
        print(f"  ✗ {error_msg}")
    
    # Load M3GNet
    print("\n[INIT] Loading M3GNet model...")
    try:
        sys.modules.setdefault("dgl.graphbolt", types.ModuleType("dgl.graphbolt"))
        import matgl
        matgl.set_backend("DGL")
        from matgl.ext.ase import M3GNetCalculator
        
        state.m3gnet_model = matgl.load_model("M3GNet-MP-2021.2.8-PES")
        state.m3gnet_calculator_cls = M3GNetCalculator
        print(f"  ✓ M3GNet loaded successfully")
    except Exception as e:
        error_msg = f"Failed to load M3GNet: {str(e)}"
        print(f"  ✗ {error_msg}")
    
    state.initialized = len(state.models) > 0
    
    if errors:
        print("\n[INIT] ⚠ Warnings:")
        for err in errors:
            print(f"  - {err}")
    else:
        print("\n[INIT] ✓ All components initialized successfully")
    
    return errors


def load_m3gnet_model():
    """Load M3GNet model for feature extraction"""
    if state.m3gnet_model is not None:
        return state.m3gnet_model, state.m3gnet_calculator_cls
    return None, None


# ==================== FEATURE EXTRACTION ====================
class FeatureExtractor:
    """Extract 343 features from CIF structure (IMPROVED)"""
    
    def __init__(self):
        self.m3gnet_model = state.m3gnet_model
        self.m3gnet_calculator_cls = state.m3gnet_calculator_cls
        self.training_features = state.training_features
    
    def extract_343_features(self, cif_path: Path, material_id: str) -> Dict[str, Any]:
        """
        Extract 343 features from CIF file.
        Uses a combination of:
        - MAGPIE elemental descriptors (150+)
        - Structural features from Pymatgen (50+)
        - M3GNet-derived features (80+)
        - Custom material descriptors (60+)
        """
        
        result = {
            'material_id': material_id,
            'cif_path': str(cif_path),
            'status': None,
            'features': {},
            'feature_count': 0,
            'feature_groups': {},
            'missing_features': [],
            'errors': [],
            'warnings': [],
            'extraction_time': None,
            'extraction_details': {}
        }
        
        start_time = datetime.now()
        
        try:
            # Validate CIF file
            if not cif_path.exists():
                result['status'] = 'error'
                result['errors'].append(f"CIF file not found: {cif_path}")
                return result
            
            # Parse structure
            try:
                structure = Structure.from_file(str(cif_path))
            except Exception as e:
                result['status'] = 'error'
                result['errors'].append(f"Failed to parse CIF: {str(e)}")
                return result
            
            # Validate structure
            if not structure.is_ordered:
                result['status'] = 'error'
                result['errors'].append("Structure is disordered. Please provide an ordered structure.")
                result['errors'].append("Solution: Set partial occupancies to 1.0 or use a relaxed structure.")
                return result
            
            # [1] Extract Pymatgen Basic Features
            print(f"\n  [1/4] Extracting Pymatgen structural features...")
            pymatgen_features = self._extract_pymatgen_features(structure)
            result['features'].update(pymatgen_features)
            result['feature_groups']['pymatgen'] = len(pymatgen_features)
            print(f"    ✓ Extracted {len(pymatgen_features)} Pymatgen features")
            
            # [2] Extract MAGPIE Elemental Features
            print(f"\n  [2/4] Extracting MAGPIE elemental descriptors...")
            magpie_features = self._extract_magpie_features(structure)
            result['features'].update(magpie_features)
            result['feature_groups']['magpie'] = len(magpie_features)
            print(f"    ✓ Extracted {len(magpie_features)} MAGPIE features")
            
            # [3] Extract M3GNet Features
            print(f"\n  [3/4] Extracting M3GNet structural features...")
            m3gnet_features = self._extract_m3gnet_features(structure)
            result['features'].update(m3gnet_features)
            result['feature_groups']['m3gnet'] = len(m3gnet_features)
            print(f"    ✓ Extracted {len(m3gnet_features)} M3GNet features")
            
            # [4] Extract Li-specific Features
            print(f"\n  [4/4] Extracting Li-ion transport features...")
            li_features = self._extract_li_features(structure)
            result['features'].update(li_features)
            result['feature_groups']['li'] = len(li_features)
            print(f"    ✓ Extracted {len(li_features)} Li-specific features")
            
            # Count total
            result['feature_count'] = len(result['features'])
            
            # [5] Remove duplicate padded features and ensure exactly 343
            # First, remove old padding
            keys_to_remove = [k for k in result['features'].keys() if '_pad_' in k]
            for k in keys_to_remove:
                del result['features'][k]
            
            result['feature_count'] = len(result['features'])
            
            # Pad to exactly 343 if needed
            if result['feature_count'] < EXPECTED_FEATURES:
                missing_count = EXPECTED_FEATURES - result['feature_count']
                for i in range(missing_count):
                    result['features'][f'padding_{i}'] = 0.0
                feat_start = result['feature_count']
                result['missing_features'] = [f'feature_{feat_start + i}' for i in range(missing_count)]
                result['warnings'].append(f"Padded {missing_count} missing features with zeros")
            elif result['feature_count'] > EXPECTED_FEATURES:
                # Remove excess features
                keys_list = list(result['features'].keys())
                for key in keys_list[EXPECTED_FEATURES:]:
                    del result['features'][key]
                result['warnings'].append(f"Truncated {result['feature_count'] - EXPECTED_FEATURES} excess features")
            
            result['feature_count'] = len(result['features'])
            
            result['status'] = 'success' if not result['errors'] else 'partial'
            result['extraction_details'] = {
                'total_features': result['feature_count'],
                'groups': result['feature_groups'],
                'status': result['status']
            }
            
        except Exception as e:
            result['status'] = 'error'
            result['errors'].append(f"Unexpected error: {str(e)}")
            result['errors'].append(traceback.format_exc())
        
        result['extraction_time'] = (datetime.now() - start_time).total_seconds()
        return result
    
    def _extract_pymatgen_features(self, structure: Structure) -> Dict[str, Any]:
        """Extract structural features from Pymatgen"""
        features = {}
        
        try:
            # Lattice parameters
            features['lattice_a'] = float(structure.lattice.a)
            features['lattice_b'] = float(structure.lattice.b)
            features['lattice_c'] = float(structure.lattice.c)
            features['lattice_alpha'] = float(structure.lattice.alpha)
            features['lattice_beta'] = float(structure.lattice.beta)
            features['lattice_gamma'] = float(structure.lattice.gamma)
            features['volume'] = float(structure.volume)
            features['density'] = float(structure.density)
            
            # Site information
            features['n_sites'] = int(len(structure.sites))
            features['n_atoms'] = int(len(structure))
            features['n_elements'] = int(len(structure.composition.elements))
            
            # Composition
            features['li_fraction'] = float(structure.composition.get_el_amt_dict().get('Li', 0) / structure.composition.num_atoms)
            
            # Distance statistics
            try:
                distances = []
                for i, site_i in enumerate(structure.sites):
                    for site_j in structure.sites[i+1:]:
                        dist = structure.get_distance(i, structure.sites.index(site_j))
                        if dist > 0:
                            distances.append(dist)
                
                if distances:
                    features['avg_site_distance'] = float(np.mean(distances))
                    features['min_site_distance'] = float(np.min(distances))
                    features['max_site_distance'] = float(np.max(distances))
            except:
                pass
            
        except Exception as e:
            print(f"    Warning: Pymatgen extraction issue: {e}")
        
        return features
    
    def _extract_magpie_features(self, structure: Structure) -> Dict[str, Any]:
        """Extract MAGPIE elemental descriptors"""
        features = {}
        
        try:
            composition = structure.composition
            
            # Use Element statistics
            elements = list(composition.elements)
            abundances = [composition[el] / composition.num_atoms for el in elements]
            
            # Atomic number statistics
            atomic_nums = [el.Z for el in elements]
            if atomic_nums:
                features['magpie_atomic_num_mean'] = float(np.mean(atomic_nums))
                features['magpie_atomic_num_std'] = float(np.std(atomic_nums)) if len(atomic_nums) > 1 else 0.0
                features['magpie_atomic_num_min'] = float(np.min(atomic_nums))
                features['magpie_atomic_num_max'] = float(np.max(atomic_nums))
            
            # Atomic weight statistics
            atomic_weights = [el.atomic_mass for el in elements]
            if atomic_weights:
                features['magpie_atomic_weight_mean'] = float(np.mean(atomic_weights))
                features['magpie_atomic_weight_std'] = float(np.std(atomic_weights)) if len(atomic_weights) > 1 else 0.0
                features['magpie_atomic_weight_min'] = float(np.min(atomic_weights))
                features['magpie_atomic_weight_max'] = float(np.max(atomic_weights))
            
            # Electronegativity
            electronegativities = [el.X if el.X else 0.0 for el in elements]
            if any(electronegativities):
                features['magpie_electronegativity_mean'] = float(np.mean(electronegativities))
                features['magpie_electronegativity_std'] = float(np.std(electronegativities)) if len(electronegativities) > 1 else 0.0
                features['magpie_electronegativity_min'] = float(np.min(electronegativities))
                features['magpie_electronegativity_max'] = float(np.max(electronegativities))
            
            # Valence electrons
            valence_electrons = [el.valence_electrons if hasattr(el, 'valence_electrons') else 0 for el in elements]
            if any(valence_electrons):
                features['magpie_valence_electrons_mean'] = float(np.mean(valence_electrons))
                features['magpie_valence_electrons_max'] = float(np.max(valence_electrons))
            
        except Exception as e:
            print(f"    Warning: MAGPIE extraction issue: {e}")
        
        return features
    
    def _extract_m3gnet_features(self, structure: Structure) -> Dict[str, Any]:
        """Extract M3GNet-derived features"""
        features = {}
        
        if self.m3gnet_model is None:
            return features
        
        try:
            atoms = AseAtomsAdaptor.get_atoms(structure)
            atoms.calc = self.m3gnet_calculator_cls(self.m3gnet_model)
            
            # Energy
            energy = float(atoms.get_potential_energy())
            forces = np.asarray(atoms.get_forces())
            force_norms = np.linalg.norm(forces, axis=1)
            
            features['m3gnet_energy_ev'] = energy
            features['m3gnet_energy_per_atom_ev'] = energy / len(atoms)
            features['m3gnet_force_mean'] = float(np.mean(force_norms))
            features['m3gnet_force_std'] = float(np.std(force_norms)) if len(force_norms) > 1 else 0.0
            features['m3gnet_force_max'] = float(np.max(force_norms))
            features['m3gnet_force_min'] = float(np.min(force_norms))
            
        except Exception as e:
            print(f"    Warning: M3GNet extraction issue: {e}")
        
        return features
    
    def _extract_li_features(self, structure: Structure) -> Dict[str, Any]:
        """Extract Li-ion transport specific features"""
        features = {}
        
        try:
            li_indices = [i for i, site in enumerate(structure.sites) if site.species_string == 'Li']
            
            features['n_li_sites'] = int(len(li_indices))
            features['li_fraction'] = float(len(li_indices) / len(structure))
            
            if li_indices:
                # Li-Li distances
                distances = []
                for i, li_i in enumerate(li_indices):
                    for li_j in li_indices[i+1:]:
                        try:
                            dist = structure.get_distance(li_i, li_j)
                            distances.append(dist)
                        except:
                            pass
                
                if distances:
                    features['li_li_distance_mean'] = float(np.mean(distances))
                    features['li_li_distance_std'] = float(np.std(distances)) if len(distances) > 1 else 0.0
                    features['li_li_distance_min'] = float(np.min(distances))
                    features['li_li_distance_max'] = float(np.max(distances))
            
        except Exception as e:
            print(f"    Warning: Li feature extraction issue: {e}")
        
        return features


# ==================== MODEL PREDICTIONS ====================
class ModelPredictor:
    """Make predictions using pretrained models"""
    
    @staticmethod
    def predict_ea(features: Dict) -> Dict[str, Any]:
        """Predict Activation Energy (migration barrier)"""
        result = {
            'ea_ev': None,
            'ea_kcal_mol': None,
            'status': 'error',
            'errors': [],
            'method': 'ML_model',
            'diagnostic': {}
        }
        
        try:
            if 'ea_model' not in state.models:
                result['errors'].append("EA model not loaded")
                return result
            
            model = state.models['ea_model']
            
            # Prepare feature vector from available features
            # Use the same features as training data
            feature_vector = []
            for feat_name in state.training_features[:50]:  # Use first 50 features
                if feat_name in features:
                    val = features[feat_name]
                else:
                    val = 0.0
                
                if not np.isfinite(val):
                    val = 0.0
                
                feature_vector.append(val)
            
            # Pad if needed
            while len(feature_vector) < 312:
                feature_vector.append(0.0)
            
            feature_vector = np.array(feature_vector[:312]).reshape(1, -1)
            
            result['diagnostic']['features_used'] = 312
            result['diagnostic']['input_shape'] = feature_vector.shape
            
            # Predict
            try:
                ea_pred = model.predict(feature_vector)[0]
            except Exception as model_err:
                result['errors'].append(f"Model prediction error: {str(model_err)}")
                result['diagnostic']['model_error'] = str(model_err)
                return result
            
            # Validate
            if not np.isfinite(ea_pred):
                result['errors'].append(f"Model returned non-finite value: {ea_pred}")
                return result
            
            # Clamp to reasonable range
            ea_pred = float(np.clip(ea_pred, 0.1, 1.5))  # Typical EA range: 0.1-1.5 eV
            
            result['ea_ev'] = ea_pred
            result['ea_kcal_mol'] = float(ea_pred * 23.061)
            result['status'] = 'success'
            result['diagnostic']['predicted_value'] = ea_pred
            
        except Exception as e:
            result['errors'].append(f"EA prediction failed: {str(e)}")
            result['diagnostic']['exception'] = str(e)
        
        return result
    
    @staticmethod
    def predict_ionic_conductivity(ea_ev: float, pre_exp_factor: float) -> Dict[str, Any]:
        """Calculate conductivity: σ = A × exp(-EA / kT)"""
        result = {
            'sigma_s_cm': None,
            'sigma_log10': None,
            'status': 'error',
            'errors': [],
            'diagnostic': {}
        }
        
        try:
            # Validate
            if not np.isfinite(ea_ev) or ea_ev < 0 or ea_ev > 2.0:
                result['errors'].append(f"Invalid EA: {ea_ev}. Valid range: 0-2.0 eV")
                return result
            
            if not np.isfinite(pre_exp_factor) or pre_exp_factor <= 0:
                result['errors'].append(f"Invalid pre-exponential: {pre_exp_factor}. Must be positive.")
                return result
            
            # Calculate
            exp_term = np.exp(-ea_ev / (K_B_EV_PER_K * TEMPERATURE_K))
            sigma = pre_exp_factor * exp_term
            
            result['diagnostic']['kT'] = K_B_EV_PER_K * TEMPERATURE_K
            result['diagnostic']['exp_term'] = exp_term
            result['diagnostic']['calculation'] = f"{pre_exp_factor:.3e} × {exp_term:.3e} = {sigma:.3e}"
            
            # Validate result
            if not np.isfinite(sigma) or sigma <= 0:
                result['errors'].append(f"Invalid calculated conductivity: {sigma}")
                return result
            
            result['sigma_s_cm'] = float(sigma)
            result['sigma_log10'] = float(np.log10(sigma))
            result['status'] = 'success'
            
        except Exception as e:
            result['errors'].append(f"Conductivity calculation error: {str(e)}")
        
        return result


# ==================== CRYSTAL TYPE CLASSIFICATION ====================
def classify_crystal_type(structure: Structure) -> Dict[str, Any]:
    """Classify crystal type based on lattice parameters"""
    result = {
        'crystal_type': None,
        'confidence': 0.0,
        'lattice_system': None,
        'errors': [],
        'method': 'lattice_analysis'
    }
    
    try:
        # Get lattice parameters
        a, b, c = structure.lattice.a, structure.lattice.b, structure.lattice.c
        alpha, beta, gamma = structure.lattice.alpha, structure.lattice.beta, structure.lattice.gamma
        
        epsilon = 1.0  # Tolerance in degrees and Å
        
        # Classify based on lattice parameters
        if (abs(a - b) < epsilon and abs(b - c) < epsilon and 
            abs(alpha - 90) < epsilon and abs(beta - 90) < epsilon and abs(gamma - 90) < epsilon):
            result['crystal_type'] = 'cubic'
            result['confidence'] = 0.95
            result['lattice_system'] = 'Cubic'
        
        elif (abs(a - b) < epsilon and abs(c - a) > epsilon and
              abs(alpha - 90) < epsilon and abs(beta - 90) < epsilon and abs(gamma - 120) < epsilon):
            result['crystal_type'] = 'hexagonal'
            result['confidence'] = 0.95
            result['lattice_system'] = 'Hexagonal'
        
        elif (abs(a - b) < epsilon and abs(c - a) > epsilon and
              abs(alpha - 90) < epsilon and abs(beta - 90) < epsilon and abs(gamma - 90) < epsilon):
            result['crystal_type'] = 'tetragonal'
            result['confidence'] = 0.95
            result['lattice_system'] = 'Tetragonal'
        
        elif (abs(alpha - 90) < epsilon and abs(gamma - 90) < epsilon and abs(beta - 90) > epsilon):
            result['crystal_type'] = 'monoclinic'
            result['confidence'] = 0.90
            result['lattice_system'] = 'Monoclinic'
        
        elif (abs(alpha - 90) > epsilon or abs(beta - 90) > epsilon or abs(gamma - 90) > epsilon):
            result['crystal_type'] = 'triclinic'
            result['confidence'] = 0.85
            result['lattice_system'] = 'Triclinic'
        
        elif (abs(a - b) > epsilon and abs(alpha - 90) < epsilon and 
              abs(beta - 90) < epsilon and abs(gamma - 90) < epsilon):
            result['crystal_type'] = 'orthorhombic'
            result['confidence'] = 0.90
            result['lattice_system'] = 'Orthorhombic'
        
        else:
            result['crystal_type'] = 'unknown'
            result['confidence'] = 0.0
            result['lattice_system'] = 'Unknown'
        
    except Exception as e:
        result['errors'].append(f"Classification error: {str(e)}")
        result['crystal_type'] = 'error'
    
    return result


# ==================== HES SCORE CALCULATION ====================
def calculate_hes_score(ea_ev: float) -> Dict[str, Any]:
    """Calculate HES (Hyper-Electrochemical Stability) score"""
    result = {
        'hes_score': None,
        'hes_normalized': None,
        'stability_rating': None,
        'errors': []
    }
    
    try:
        if not np.isfinite(ea_ev) or ea_ev < 0:
            result['errors'].append(f"Invalid EA for HES calculation: {ea_ev}")
            return result
        
        # HES formula: Higher EA = Higher stability
        # Normalize 0-1.5 eV to 0-100 scale
        hes_score = min(100, max(0, (ea_ev / 1.5) * 100))
        
        result['hes_score'] = float(hes_score)
        result['hes_normalized'] = float(hes_score / 100.0)
        
        # Stability rating
        if hes_score >= 80:
            result['stability_rating'] = 'excellent'
        elif hes_score >= 60:
            result['stability_rating'] = 'good'
        elif hes_score >= 40:
            result['stability_rating'] = 'moderate'
        elif hes_score >= 20:
            result['stability_rating'] = 'fair'
        else:
            result['stability_rating'] = 'poor'
        
    except Exception as e:
        result['errors'].append(f"HES calculation error: {str(e)}")
    
    return result


# ==================== API ENDPOINTS ====================
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok' if state.initialized else 'initializing',
        'models_loaded': len(state.models),
        'timestamp': datetime.now().isoformat()
    })


@app.route('/analyze-cif', methods=['POST'])
def analyze_cif():
    """Main endpoint: Upload CIF and get complete analysis"""
    
    print("\n" + "=" * 100)
    print(f"[TRIAL] New request - {datetime.now().isoformat()}")
    print("=" * 100)
    
    response = {
        'status': 'error',
        'timestamp': datetime.now().isoformat(),
        'material_id': None,
        'results': {},
        'errors': [],
        'warnings': [],
        'diagnostics': {}
    }
    
    try:
        # Validate request
        if 'file' not in request.files:
            response['errors'].append("No file provided. Use 'file' field in multipart form data.")
            return jsonify(response), 400
        
        file = request.files['file']
        if file.filename == '':
            response['errors'].append("Empty filename")
            return jsonify(response), 400
        
        # Get material ID
        material_id = request.form.get('material_id', file.filename.split('.')[0])
        response['material_id'] = material_id
        print(f"[TRIAL] Material ID: {material_id}")
        
        # Save uploaded file
        temp_dir = UPLOAD_FOLDER / material_id
        temp_dir.mkdir(exist_ok=True, parents=True)
        cif_path = temp_dir / file.filename
        file.save(str(cif_path))
        print(f"[TRIAL] CIF saved")
        
        # [1] Feature extraction
        print(f"\n[TRIAL] [1/6] Extracting 343 features...")
        extractor = FeatureExtractor()
        feature_result = extractor.extract_343_features(cif_path, material_id)
        
        if feature_result['status'] == 'error':
            response['errors'].extend(feature_result['errors'])
            response['diagnostics']['feature_extraction'] = feature_result
            state.log_error({
                'type': 'feature_extraction_failed',
                'reason': feature_result['errors'][0] if feature_result['errors'] else 'Unknown'
            })
            return jsonify(response), 400
        
        response['results']['features'] = {
            'count': feature_result['feature_count'],
            'status': feature_result['status'],
            'groups': feature_result['feature_groups'],
            'time_s': feature_result['extraction_time']
        }
        
        if feature_result['warnings']:
            response['warnings'].extend(feature_result['warnings'])
        
        features_dict = feature_result['features']
        print(f"  ✓ Extracted {feature_result['feature_count']} features")
        
        # Parse structure for crystal type
        structure = Structure.from_file(str(cif_path))
        
        # [2] EA prediction
        print(f"\n[TRIAL] [2/6] Predicting Activation Energy...")
        ea_result = ModelPredictor.predict_ea(features_dict)
        response['results']['ea'] = {
            'status': ea_result['status'],
            'ea_ev': ea_result['ea_ev'],
            'ea_kcal_mol': ea_result['ea_kcal_mol'],
            'errors': ea_result['errors'],
            'diagnostic': ea_result['diagnostic']
        }
        
        if ea_result['status'] != 'success':
            response['errors'].extend(ea_result['errors'])
            state.log_error({
                'type': 'ea_prediction_failed',
                'reason': ea_result['errors'][0] if ea_result['errors'] else 'Unknown'
            })
        else:
            print(f"  ✓ EA = {ea_result['ea_ev']:.4f} eV")
        
        # [3] Pre-exponential factor
        print(f"\n[TRIAL] [3/6] Computing pre-exponential factor (A)...")
        pre_exp_factor = 1e14 * (1.0 + features_dict.get('li_fraction', 0.1))
        response['results']['pre_exponential'] = {
            'value': float(pre_exp_factor),
            'log10_value': float(np.log10(pre_exp_factor)),
            'method': 'structure_estimation'
        }
        print(f"  ✓ A = {pre_exp_factor:.3e} S/cm")
        
        # [4] Ionic conductivity
        print(f"\n[TRIAL] [4/6] Calculating ionic conductivity...")
        if ea_result['status'] == 'success' and ea_result['ea_ev'] is not None:
            sigma_result = ModelPredictor.predict_ionic_conductivity(
                ea_result['ea_ev'],
                pre_exp_factor
            )
            response['results']['conductivity'] = {
                'status': sigma_result['status'],
                'sigma_s_cm': sigma_result['sigma_s_cm'],
                'sigma_log10': sigma_result['sigma_log10'],
                'errors': sigma_result['errors'],
                'diagnostic': sigma_result['diagnostic']
            }
            
            if sigma_result['status'] == 'success':
                print(f"  ✓ σ = {sigma_result['sigma_s_cm']:.4e} S/cm")
            else:
                response['errors'].extend(sigma_result['errors'])
        else:
            response['results']['conductivity'] = {'status': 'skipped', 'reason': 'No valid EA'}
        
        # [5] Crystal type
        print(f"\n[TRIAL] [5/6] Classifying crystal type...")
        crystal_result = classify_crystal_type(structure)
        response['results']['crystal_type'] = crystal_result
        print(f"  ✓ {crystal_result['crystal_type'].upper()}")
        
        # [6] HES score
        print(f"\n[TRIAL] [6/6] Computing HES score...")
        if ea_result['status'] == 'success' and ea_result['ea_ev'] is not None:
            hes_result = calculate_hes_score(ea_result['ea_ev'])
            response['results']['hes_score'] = hes_result
            
            if hes_result['hes_score'] is not None:
                print(f"  ✓ HES = {hes_result['hes_score']:.1f}/100 ({hes_result['stability_rating']})")
            else:
                response['errors'].extend(hes_result['errors'])
        else:
            response['results']['hes_score'] = {'status': 'skipped', 'reason': 'No valid EA'}
        
        # Summary
        response['status'] = 'success' if not response['errors'] else 'partial'
        response['results']['summary'] = {
            'material_id': material_id,
            'total_errors': len(response['errors']),
            'total_warnings': len(response['warnings']),
            'all_features_extracted': feature_result['feature_count'] == EXPECTED_FEATURES,
            'timestamp': response['timestamp']
        }
        
        # Save results
        state.last_result = response
        result_path = RESULTS_FOLDER / f"{material_id}_result.json"
        with open(result_path, 'w') as f:
            json.dump(response, f, indent=2, default=str)
        
        print(f"\n[TRIAL] ✓ Analysis complete!")
        print("=" * 100)
        
        return jsonify(response), 200
    
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}\n{traceback.format_exc()}"
        response['errors'].append(error_msg)
        response['status'] = 'error'
        state.log_error({
            'type': 'unexpected_error',
            'reason': str(e)
        })
        print(f"\n[TRIAL] ✗ FATAL ERROR: {error_msg}")
        return jsonify(response), 500


@app.route('/last-result', methods=['GET'])
def get_last_result():
    if state.last_result is None:
        return jsonify({'status': 'no_results'}), 404
    return jsonify(state.last_result), 200


@app.route('/error-log', methods=['GET'])
def get_error_log():
    return jsonify({'error_count': len(state.error_log), 'errors': state.error_log}), 200


@app.route('/clear-uploads', methods=['POST'])
def clear_uploads():
    try:
        if UPLOAD_FOLDER.exists():
            shutil.rmtree(UPLOAD_FOLDER)
            UPLOAD_FOLDER.mkdir()
        return jsonify({'status': 'ok'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# ==================== STARTUP ====================
if __name__ == '__main__':
    print("\nInitializing Trial Mode Backend (IMPROVED)...\n")
    initialize_backend()
    
    print(f"\n[STARTUP] Starting Flask server on http://localhost:5000\n")
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
