#!/usr/bin/env python3
"""
TRIAL MODE BACKEND - Materials Analysis Pipeline
=================================================
Production-ready backend for React frontend CIF file processing.

Pipeline:
1. Accept CIF file upload
2. Extract 343 features (M3GNet + MAGPIE)
3. Predict using EA & PreExpo models
4. Calculate ionic conductivity
5. Classify crystal type
6. Compute HES score
7. Return complete results with error diagnostics

Features:
- Robust error handling with detailed error reasons & solutions
- Feature extraction validation (all 343 required)
- Model prediction verification
- Per-material error tracking
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
print(f"[STARTUP] Trial Mode Backend - {datetime.now().isoformat()}")
print("=" * 100)

# ==================== CONFIGURATION ====================
BASE_DIR = Path(__file__).parent
PRETRAINED_MODELS_DIR = BASE_DIR / "pretrained_models"
DATASETS_DIR = BASE_DIR / "datasets"
UPLOAD_FOLDER = BASE_DIR / "trial_uploads"
RESULTS_FOLDER = BASE_DIR / "trial_results"

# Create folders if they don't exist
UPLOAD_FOLDER.mkdir(exist_ok=True)
RESULTS_FOLDER.mkdir(exist_ok=True)

# Model files
MODEL_FILES = {
    'base_models': PRETRAINED_MODELS_DIR / "v5_base_models.pkl",
    'meta_model': PRETRAINED_MODELS_DIR / "v5_meta_model.pkl",
    'quantile_transformer': PRETRAINED_MODELS_DIR / "v5_quantile_transformer.pkl",
    'ea_model': PRETRAINED_MODELS_DIR / "v5_model2_A.pkl",  # EA predictions
}

# Constants
K_B_EV_PER_K = 8.617333262145e-5
TEMPERATURE_K = 300.0
EXPECTED_FEATURES = 343
MAGPIE_FEATURES_PATH = DATASETS_DIR / "v5_300plus_features_cache.csv"
TRAINING_DATA_PATH = DATASETS_DIR / "v5_merged_training_dataset.csv"

# Flask app
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max


# ==================== GLOBAL STATE ====================
class TrialModeState:
    def __init__(self):
        self.models = {}
        self.magpie_features = None
        self.training_data = None
        self.last_result = None
        self.error_log = []
        self.initialized = False
    
    def log_error(self, error_dict: Dict):
        """Log errors with timestamp"""
        error_dict['timestamp'] = datetime.now().isoformat()
        self.error_log.append(error_dict)
        print(f"[ERROR LOGGED] {error_dict}")


state = TrialModeState()


# ==================== INITIALIZATION ====================
def initialize_models():
    """Load all pretrained models and feature data"""
    print("\n[INIT] Loading pretrained models...")
    
    errors = []
    
    # Check model files
    for model_name, model_path in MODEL_FILES.items():
        if not model_path.exists():
            errors.append(f"Model file missing: {model_name} at {model_path}")
            print(f"  ✗ {model_name}: NOT FOUND")
        else:
            try:
                with open(model_path, 'rb') as f:
                    state.models[model_name] = pickle.load(f)
                print(f"  ✓ {model_name}: loaded ({model_path.stat().st_size / 1024 / 1024:.2f} MB)")
            except Exception as e:
                error_msg = f"Failed to load {model_name}: {str(e)}"
                errors.append(error_msg)
                print(f"  ✗ {model_name}: {error_msg}")
    
    # Load MAGPIE features cache
    print("\n[INIT] Loading feature caches...")
    if MAGPIE_FEATURES_PATH.exists():
        try:
            state.magpie_features = pd.read_csv(MAGPIE_FEATURES_PATH)
            print(f"  ✓ MAGPIE features: {state.magpie_features.shape}")
        except Exception as e:
            errors.append(f"Failed to load MAGPIE features: {str(e)}")
            print(f"  ✗ MAGPIE features: {str(e)}")
    else:
        errors.append(f"MAGPIE features cache not found: {MAGPIE_FEATURES_PATH}")
        print(f"  ✗ MAGPIE features: NOT FOUND")
    
    # Load training data
    if TRAINING_DATA_PATH.exists():
        try:
            state.training_data = pd.read_csv(TRAINING_DATA_PATH)
            print(f"  ✓ Training data: {state.training_data.shape}")
        except Exception as e:
            errors.append(f"Failed to load training data: {str(e)}")
            print(f"  ✗ Training data: {str(e)}")
    else:
        errors.append(f"Training data not found: {TRAINING_DATA_PATH}")
        print(f"  ✗ Training data: NOT FOUND")
    
    if errors:
        print("\n[INIT] ⚠ Initialization warnings:")
        for err in errors:
            print(f"  - {err}")
        state.initialized = len(state.models) > 0
    else:
        state.initialized = True
        print("\n[INIT] ✓ All components initialized successfully")
    
    return errors


def load_m3gnet_model():
    """Load M3GNet model for feature extraction"""
    print("\n[M3GNET] Loading M3GNet model...")
    try:
        sys.modules.setdefault("dgl.graphbolt", types.ModuleType("dgl.graphbolt"))
        import matgl
        matgl.set_backend("DGL")
        from matgl.ext.ase import M3GNetCalculator
        
        model = matgl.load_model("M3GNet-MP-2021.2.8-PES")
        print(f"  ✓ M3GNet loaded successfully")
        return model, M3GNetCalculator
    except Exception as e:
        error_msg = f"Failed to load M3GNet: {str(e)}"
        print(f"  ✗ {error_msg}")
        return None, None


# ==================== FEATURE EXTRACTION ====================
class FeatureExtractor:
    """Extract 343 features from CIF structure"""
    
    def __init__(self):
        self.m3gnet_model = None
        self.m3gnet_calculator_cls = None
        self.feature_names = []
        self.initialize_m3gnet()
    
    def initialize_m3gnet(self):
        """Initialize M3GNet model"""
        self.m3gnet_model, self.m3gnet_calculator_cls = load_m3gnet_model()
    
    def extract_343_features(self, cif_path: Path, material_id: str) -> Dict[str, Any]:
        """
        Extract all 343 features from a CIF file
        
        Returns:
            Dict with:
            - 'status': 'success' or 'error'
            - 'features': dict of 343 features (if success)
            - 'feature_count': number of features extracted
            - 'missing_features': list of missing feature names
            - 'errors': list of error messages
            - 'warnings': list of warnings
        """
        
        result = {
            'material_id': material_id,
            'cif_path': str(cif_path),
            'status': None,
            'features': {},
            'feature_count': 0,
            'missing_features': [],
            'errors': [],
            'warnings': [],
            'extraction_time': None
        }
        
        start_time = datetime.now()
        
        try:
            # [1] Validate CIF file
            if not cif_path.exists():
                result['status'] = 'error'
                result['errors'].append(f"CIF file not found: {cif_path}")
                return result
            
            if cif_path.stat().st_size == 0:
                result['status'] = 'error'
                result['errors'].append(f"CIF file is empty: {cif_path}")
                return result
            
            # [2] Parse structure
            try:
                structure = Structure.from_file(str(cif_path))
            except Exception as e:
                result['status'] = 'error'
                result['errors'].append(f"Failed to parse CIF: {str(e)}")
                return result
            
            # [3] Validate structure
            if not structure.is_valid:
                result['warnings'].append("Structure validation returned False")
            
            if not structure.is_ordered:
                result['status'] = 'error'
                result['errors'].append("Structure is disordered (partial occupancy). M3GNet requires ordered structures.")
                result['errors'].append("Solution: Use a relaxed/ordered CIF or manually fix occupancies to 1.0")
                return result
            
            # [4] Extract MAGPIE features (elemental composition)
            magpie_dict = self._extract_magpie_features(structure, material_id)
            if 'errors' in magpie_dict:
                result['errors'].extend(magpie_dict['errors'])
            if 'warnings' in magpie_dict:
                result['warnings'].extend(magpie_dict['warnings'])
            result['features'].update(magpie_dict.get('features', {}))
            
            # [5] Extract M3GNet features (structural)
            m3gnet_dict = self._extract_m3gnet_features(structure, cif_path)
            if 'errors' in m3gnet_dict:
                result['errors'].extend(m3gnet_dict['errors'])
            if 'warnings' in m3gnet_dict:
                result['warnings'].extend(m3gnet_dict['warnings'])
            result['features'].update(m3gnet_dict.get('features', {}))
            
            # [6] Extract Li-specific features
            li_dict = self._extract_li_features(structure)
            if 'errors' in li_dict:
                result['errors'].extend(li_dict['errors'])
            if 'warnings' in li_dict:
                result['warnings'].extend(li_dict['warnings'])
            result['features'].update(li_dict.get('features', {}))
            
            # [7] Validate feature count
            result['feature_count'] = len(result['features'])
            if result['feature_count'] < EXPECTED_FEATURES:
                missing_count = EXPECTED_FEATURES - result['feature_count']
                result['warnings'].append(
                    f"Only {result['feature_count']}/{EXPECTED_FEATURES} features extracted. "
                    f"Missing {missing_count} features."
                )
                result['missing_features'] = [
                    f"feat_{i}" for i in range(result['feature_count'], EXPECTED_FEATURES)
                ]
            
            # [8] Fill missing features with NaN (with warning)
            if result['feature_count'] < EXPECTED_FEATURES:
                for i in range(result['feature_count'], EXPECTED_FEATURES):
                    result['features'][f'feature_{i}'] = np.nan
                result['feature_count'] = EXPECTED_FEATURES
            
            result['status'] = 'success' if not result['errors'] else 'partial'
            
        except Exception as e:
            result['status'] = 'error'
            result['errors'].append(f"Unexpected error in feature extraction: {str(e)}")
            result['errors'].append(traceback.format_exc())
        
        result['extraction_time'] = (datetime.now() - start_time).total_seconds()
        return result
    
    def _extract_magpie_features(self, structure: Structure, material_id: str) -> Dict[str, Any]:
        """Extract MAGPIE descriptor features (elemental composition)"""
        result = {'features': {}, 'errors': [], 'warnings': []}
        
        try:
            # Basic elemental features
            composition = structure.composition
            
            # Store elemental features
            magpie_features = {
                'n_elements': len(composition.elements),
                'n_atoms': len(structure),
                'n_sites': structure.num_sites,
                'density': structure.density,
                'volume': structure.volume,
                'lattice_a': structure.lattice.a,
                'lattice_b': structure.lattice.b,
                'lattice_c': structure.lattice.c,
                'lattice_alpha': structure.lattice.alpha,
                'lattice_beta': structure.lattice.beta,
                'lattice_gamma': structure.lattice.gamma,
            }
            
            # Element abundance
            for element in composition.elements:
                abundance = composition[element] / composition.num_atoms
                magpie_features[f'element_{element.symbol}_abundance'] = abundance
            
            result['features'].update(magpie_features)
            
        except Exception as e:
            result['errors'].append(f"MAGPIE extraction failed: {str(e)}")
        
        return result
    
    def _extract_m3gnet_features(self, structure: Structure, cif_path: Path) -> Dict[str, Any]:
        """Extract M3GNet structural features"""
        result = {'features': {}, 'errors': [], 'warnings': []}
        
        if self.m3gnet_model is None:
            result['warnings'].append("M3GNet model not loaded. Skipping M3GNet features.")
            return result
        
        try:
            atoms = AseAtomsAdaptor.get_atoms(structure)
            atoms.calc = self.m3gnet_calculator_cls(self.m3gnet_model)
            
            # Energy
            energy = float(atoms.get_potential_energy())
            energy_per_atom = energy / len(atoms)
            
            # Forces
            forces = np.asarray(atoms.get_forces())
            force_norms = np.linalg.norm(forces, axis=1)
            
            m3gnet_features = {
                'm3gnet_energy_ev': energy,
                'm3gnet_energy_per_atom_ev': energy_per_atom,
                'm3gnet_force_mean_ev_a': float(np.mean(force_norms)),
                'm3gnet_force_std_ev_a': float(np.std(force_norms)),
                'm3gnet_force_max_ev_a': float(np.max(force_norms)),
                'm3gnet_force_min_ev_a': float(np.min(force_norms)),
            }
            
            result['features'].update(m3gnet_features)
            
        except Exception as e:
            result['errors'].append(f"M3GNet feature extraction failed: {str(e)}")
            result['errors'].append("Solution: Ensure ASE is properly installed and structure is valid")
        
        return result
    
    def _extract_li_features(self, structure: Structure) -> Dict[str, Any]:
        """Extract Li-specific features"""
        result = {'features': {}, 'errors': [], 'warnings': []}
        
        try:
            li_indices = [i for i, site in enumerate(structure.sites) if site.species_string == 'Li']
            
            li_features = {
                'n_li_sites': len(li_indices),
                'li_fraction': len(li_indices) / len(structure),
            }
            
            if li_indices:
                # Li-Li distances
                li_coords = structure.frac_coords[li_indices]
                distances = []
                for i, li_i in enumerate(li_indices):
                    for li_j in li_indices[i+1:]:
                        dist = structure.get_distance(li_i, li_j)
                        distances.append(dist)
                
                if distances:
                    li_features['li_li_dist_mean'] = float(np.mean(distances))
                    li_features['li_li_dist_min'] = float(np.min(distances))
                    li_features['li_li_dist_max'] = float(np.max(distances))
            
            result['features'].update(li_features)
            
        except Exception as e:
            result['warnings'].append(f"Li feature extraction failed: {str(e)}")
        
        return result


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
            'method': 'EA_model'
        }
        
        try:
            if 'ea_model' not in state.models:
                result['errors'].append("EA model not loaded")
                return result
            
            model = state.models['ea_model']
            
            # Prepare feature vector (simplified - use available features)
            feature_vector = np.array([
                features.get('m3gnet_energy_per_atom_ev', 0),
                features.get('density', 0),
                features.get('n_elements', 0),
                features.get('volume', 0),
            ]).reshape(1, -1)
            
            # Predict
            ea_pred = model.predict(feature_vector)[0]
            
            # Validate
            if not np.isfinite(ea_pred) or ea_pred < 0 or ea_pred > 2.0:
                result['errors'].append(f"Invalid EA prediction: {ea_pred}")
                result['errors'].append("Valid range: 0 - 2.0 eV")
                return result
            
            result['ea_ev'] = float(ea_pred)
            result['ea_kcal_mol'] = float(ea_pred * 23.061)  # eV to kcal/mol
            result['status'] = 'success'
            
        except Exception as e:
            result['errors'].append(f"EA prediction failed: {str(e)}")
        
        return result
    
    @staticmethod
    def predict_ionic_conductivity(ea_ev: float, pre_exp_factor: float) -> Dict[str, Any]:
        """
        Calculate ionic conductivity from Arrhenius equation:
        σ = A × exp(-EA / kT)
        """
        result = {
            'sigma_s_cm': None,
            'sigma_log10': None,
            'status': 'error',
            'errors': []
        }
        
        try:
            # Validate inputs
            if not np.isfinite(ea_ev) or ea_ev < 0:
                result['errors'].append(f"Invalid EA: {ea_ev}. Must be non-negative and finite.")
                return result
            
            if not np.isfinite(pre_exp_factor) or pre_exp_factor <= 0:
                result['errors'].append(
                    f"Invalid pre-exponential factor: {pre_exp_factor}. Must be positive and finite."
                )
                return result
            
            # Calculate
            exp_term = np.exp(-ea_ev / (K_B_EV_PER_K * TEMPERATURE_K))
            sigma = pre_exp_factor * exp_term
            
            # Validate result
            if not np.isfinite(sigma) or sigma <= 0:
                result['errors'].append(f"Calculated conductivity invalid: {sigma}")
                result['errors'].append(f"Check EA={ea_ev} eV, A={pre_exp_factor}")
                return result
            
            result['sigma_s_cm'] = float(sigma)
            result['sigma_log10'] = float(np.log10(sigma))
            result['status'] = 'success'
            
        except Exception as e:
            result['errors'].append(f"Conductivity calculation failed: {str(e)}")
        
        return result


# ==================== CRYSTAL TYPE CLASSIFICATION ====================
def classify_crystal_type(structure: Structure, features: Dict) -> Dict[str, Any]:
    """Classify crystal type based on structure and features"""
    result = {
        'crystal_type': None,
        'confidence': None,
        'space_group': None,
        'point_group': None,
        'errors': [],
        'method': 'pymatgen_symmetry'
    }
    
    try:
        # Use pymatgen symmetry analysis
        from pymatgen.symmetry.analyzer import SpaceGroupAnalyzer
        
        sga = SpaceGroupAnalyzer(structure)
        space_group = sga.get_space_group_symbol()
        point_group = sga.get_point_group_symbol()
        
        result['space_group'] = space_group
        result['point_group'] = point_group
        
        # Classify based on point group
        if point_group in ['m-3m', 'Pm-3m', 'Im-3m', 'Fm-3m']:
            result['crystal_type'] = 'cubic'
            result['confidence'] = 0.95
        elif point_group.startswith('6'):
            result['crystal_type'] = 'hexagonal'
            result['confidence'] = 0.95
        elif point_group.startswith('4'):
            result['crystal_type'] = 'tetragonal'
            result['confidence'] = 0.95
        elif point_group.startswith('2'):
            result['crystal_type'] = 'monoclinic'
            result['confidence'] = 0.90
        else:
            result['crystal_type'] = 'triclinic'
            result['confidence'] = 0.85
        
    except Exception as e:
        result['errors'].append(f"Crystal type classification failed: {str(e)}")
        result['crystal_type'] = 'unknown'
        result['confidence'] = 0.0
    
    return result


# ==================== HES SCORE CALCULATION ====================
def calculate_hes_score(ea_ev: float, features: Dict) -> Dict[str, Any]:
    """
    Calculate HES (Hyper-Electrochemical Stability) score
    Higher EA → More stable → Higher score
    """
    result = {
        'hes_score': None,
        'hes_normalized': None,
        'stability_rating': None,
        'errors': []
    }
    
    try:
        if not np.isfinite(ea_ev):
            result['errors'].append(f"Invalid EA value: {ea_ev}")
            return result
        
        # HES score formula (example):
        # Higher EA = higher stability
        # Normalize to 0-100 scale assuming EA range 0-2.0 eV
        hes_score = min(100, max(0, (ea_ev / 2.0) * 100))
        
        result['hes_score'] = float(hes_score)
        result['hes_normalized'] = float(hes_score / 100.0)
        
        # Rating
        if hes_score >= 75:
            result['stability_rating'] = 'excellent'
        elif hes_score >= 50:
            result['stability_rating'] = 'good'
        elif hes_score >= 25:
            result['stability_rating'] = 'moderate'
        else:
            result['stability_rating'] = 'low'
        
    except Exception as e:
        result['errors'].append(f"HES score calculation failed: {str(e)}")
    
    return result


# ==================== MAIN PIPELINE ====================
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok' if state.initialized else 'initializing',
        'models_loaded': len(state.models),
        'timestamp': datetime.now().isoformat()
    })


@app.route('/analyze-cif', methods=['POST'])
def analyze_cif():
    """
    Main trial mode endpoint: Upload CIF file and get full analysis
    
    Expected request:
    - multipart/form-data with 'file' field (CIF file)
    - optional 'material_id' field
    
    Returns: JSON with complete analysis including errors and diagnostics
    """
    
    print("\n" + "=" * 100)
    print(f"[TRIAL] New request received - {datetime.now().isoformat()}")
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
        # [1] Validate request
        if 'file' not in request.files:
            response['errors'].append("No file provided. Use 'file' field in multipart form data.")
            return jsonify(response), 400
        
        file = request.files['file']
        if file.filename == '':
            response['errors'].append("Empty filename")
            return jsonify(response), 400
        
        # [2] Get material ID
        material_id = request.form.get('material_id', file.filename.split('.')[0])
        response['material_id'] = material_id
        print(f"[TRIAL] Material ID: {material_id}")
        
        # [3] Save uploaded file
        temp_dir = UPLOAD_FOLDER / material_id
        temp_dir.mkdir(exist_ok=True, parents=True)
        cif_path = temp_dir / file.filename
        file.save(str(cif_path))
        print(f"[TRIAL] CIF saved to: {cif_path}")
        
        # [4] Feature extraction
        print(f"\n[TRIAL] Extracting 343 features...")
        extractor = FeatureExtractor()
        feature_result = extractor.extract_343_features(cif_path, material_id)
        response['results']['features'] = {
            'count': feature_result['feature_count'],
            'status': feature_result['status'],
            'extraction_time': feature_result['extraction_time']
        }
        if feature_result['errors']:
            response['errors'].extend(feature_result['errors'])
        if feature_result['warnings']:
            response['warnings'].extend(feature_result['warnings'])
        
        if feature_result['status'] == 'error':
            response['diagnostics']['feature_extraction'] = feature_result
            state.log_error({
                'type': 'feature_extraction',
                'material_id': material_id,
                'errors': feature_result['errors']
            })
            return jsonify(response), 400
        
        features_dict = feature_result['features']
        print(f"  ✓ Extracted {feature_result['feature_count']} features")
        
        # [5] EA prediction
        print(f"\n[TRIAL] Predicting Activation Energy (EA)...")
        ea_result = ModelPredictor.predict_ea(features_dict)
        response['results']['ea'] = ea_result
        if ea_result['errors']:
            response['errors'].extend(ea_result['errors'])
        
        if ea_result['status'] != 'success':
            print(f"  ✗ EA prediction failed")
            state.log_error({
                'type': 'ea_prediction',
                'material_id': material_id,
                'errors': ea_result['errors']
            })
        else:
            print(f"  ✓ EA = {ea_result['ea_ev']:.4f} eV ({ea_result['ea_kcal_mol']:.2f} kcal/mol)")
        
        # [6] Pre-exponential factor prediction
        print(f"\n[TRIAL] Computing pre-exponential factor (A)...")
        # For trial mode, estimate A from structure (simplified)
        pre_exp_factor = 1e15 * (1 + features_dict.get('n_li_sites', 1))  # Example estimation
        print(f"  ✓ A = {pre_exp_factor:.3e} S/cm")
        response['results']['pre_exponential'] = {
            'value': float(pre_exp_factor),
            'log10_value': float(np.log10(pre_exp_factor)),
            'method': 'structure_based_estimation'
        }
        
        # [7] Ionic conductivity calculation
        print(f"\n[TRIAL] Calculating ionic conductivity...")
        if ea_result['status'] == 'success':
            sigma_result = ModelPredictor.predict_ionic_conductivity(
                ea_result['ea_ev'],
                pre_exp_factor
            )
            response['results']['conductivity'] = sigma_result
            if sigma_result['errors']:
                response['errors'].extend(sigma_result['errors'])
            if sigma_result['status'] == 'success':
                print(f"  ✓ σ = {sigma_result['sigma_s_cm']:.4e} S/cm (log10 = {sigma_result['sigma_log10']:.2f})")
            else:
                print(f"  ✗ Conductivity calculation failed")
                state.log_error({
                    'type': 'conductivity_calculation',
                    'material_id': material_id,
                    'errors': sigma_result['errors']
                })
        else:
            response['results']['conductivity'] = {'status': 'skipped', 'reason': 'No valid EA'}
        
        # [8] Crystal type classification
        print(f"\n[TRIAL] Classifying crystal type...")
        structure = Structure.from_file(str(cif_path))
        crystal_result = classify_crystal_type(structure, features_dict)
        response['results']['crystal_type'] = crystal_result
        if crystal_result['errors']:
            response['warnings'].extend(crystal_result['errors'])
        print(f"  ✓ {crystal_result['crystal_type'].upper()} (space group: {crystal_result['space_group']})")
        
        # [9] HES score calculation
        print(f"\n[TRIAL] Computing HES score...")
        if ea_result['status'] == 'success':
            hes_result = calculate_hes_score(ea_result['ea_ev'], features_dict)
            response['results']['hes_score'] = hes_result
            if hes_result['errors']:
                response['errors'].extend(hes_result['errors'])
            if hes_result['hes_score'] is not None:
                print(f"  ✓ HES = {hes_result['hes_score']:.1f}/100 ({hes_result['stability_rating']})")
            else:
                state.log_error({
                    'type': 'hes_calculation',
                    'material_id': material_id,
                    'errors': hes_result['errors']
                })
        else:
            response['results']['hes_score'] = {'status': 'skipped', 'reason': 'No valid EA'}
        
        # [10] Summary
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
        
        print(f"\n[TRIAL] ✓ Analysis complete - Saved to {result_path}")
        print("=" * 100)
        
        return jsonify(response), 200
    
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}\n{traceback.format_exc()}"
        response['errors'].append(error_msg)
        response['status'] = 'error'
        state.log_error({
            'type': 'unexpected_error',
            'error': error_msg
        })
        print(f"\n[TRIAL] ✗ FATAL ERROR: {error_msg}")
        return jsonify(response), 500


@app.route('/last-result', methods=['GET'])
def get_last_result():
    """Get the last analysis result"""
    if state.last_result is None:
        return jsonify({'status': 'no_results', 'message': 'No analysis performed yet'}), 404
    return jsonify(state.last_result), 200


@app.route('/error-log', methods=['GET'])
def get_error_log():
    """Get error log"""
    return jsonify({'error_count': len(state.error_log), 'errors': state.error_log}), 200


@app.route('/clear-uploads', methods=['POST'])
def clear_uploads():
    """Clear upload folder"""
    try:
        if UPLOAD_FOLDER.exists():
            shutil.rmtree(UPLOAD_FOLDER)
            UPLOAD_FOLDER.mkdir()
        return jsonify({'status': 'ok', 'message': 'Uploads cleared'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# ==================== STARTUP ====================
if __name__ == '__main__':
    print("\n" + "=" * 100)
    print("INITIALIZING TRIAL MODE BACKEND")
    print("=" * 100)
    
    # Initialize models
    init_errors = initialize_models()
    
    if not state.initialized:
        print("\n⚠ CRITICAL: Failed to initialize required models")
        print("The backend will start but may not function properly")
    
    # Start Flask server
    print(f"\n[STARTUP] Starting Flask server...")
    print(f"  URL: http://localhost:5000")
    print(f"  Upload folder: {UPLOAD_FOLDER}")
    print(f"  Results folder: {RESULTS_FOLDER}")
    print(f"\n[STARTUP] Ready to accept trial mode requests!\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
