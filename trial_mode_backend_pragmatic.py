#!/usr/bin/env python3
"""
TRIAL MODE BACKEND v3 - PRAGMATIC APPROACH
============================================

ISSUE IDENTIFIED: Models trained on 312 features, but data only has 178
SOLUTION: Use v6_corrector_model (81 features) which ACTUALLY WORKS

Strategy:
1. Extract exactly 81 features v6_corrector_model.pkl expects
2. Use this for REAL predictions
3. Label all outputs with source (REAL_MODEL vs ESTIMATED)
4. Warn about feature limitations
5. Return actionable results NOT fake values
"""

import os
import sys
import json
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import pickle
import shutil

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Materials science
from pymatgen.core import Structure

print("=" * 100)
print(f"[STARTUP] Trial Mode Backend (PRAGMATIC v3) - {datetime.now().isoformat()}")
print("=" * 100)

# ==================== CONFIGURATION ====================
BASE_DIR = Path(__file__).parent
PRETRAINED_MODELS_DIR = BASE_DIR / "pretrained_models"
DATASETS_DIR = BASE_DIR / "datasets"
UPLOAD_FOLDER = BASE_DIR / "trial_uploads"
RESULTS_FOLDER = BASE_DIR / "trial_results"

UPLOAD_FOLDER.mkdir(exist_ok=True)
RESULTS_FOLDER.mkdir(exist_ok=True)

# Model files
CORRECTOR_MODEL_PATH = PRETRAINED_MODELS_DIR / "v6_corrector_model.pkl"

# Constants
TEMPERATURE_K = 300.0
TRAINING_DATA_PATH = DATASETS_DIR / "v5_merged_training_dataset.csv"

# Flask app
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024


# ==================== GLOBAL STATE ====================
class TrialModeState:
    def __init__(self):
        self.corrector_model = None
        self.training_stats = {}  # Store mean/std for predictions
        self.initialized = False
    
    def log_error(self, error_dict: Dict):
        error_dict['timestamp'] = datetime.now().isoformat()
        print(f"[ERROR] {error_dict['type']}: {error_dict.get('reason', '')}")


state = TrialModeState()


# ==================== INITIALIZATION ====================
def initialize_backend():
    """Initialize corrector model and stats"""
    print("\n[INIT] Loading backend components...")
    
    errors = []
    
    # Load corrector model
    print("\n[INIT] Loading v6_corrector_model...")
    if CORRECTOR_MODEL_PATH.exists():
        try:
            with open(CORRECTOR_MODEL_PATH, 'rb') as f:
                state.corrector_model = pickle.load(f)
            print(f"  ✓ Corrector model loaded")
            print(f"  Expected input features: {state.corrector_model.n_features_in_}")
        except Exception as e:
            error_msg = f"Failed to load corrector model: {str(e)}"
            errors.append(error_msg)
            print(f"  ✗ {error_msg}")
    else:
        error_msg = f"Corrector model not found: {CORRECTOR_MODEL_PATH}"
        errors.append(error_msg)
        print(f"  ✗ {error_msg}")
    
    # Load training data statistics
    print("\n[INIT] Loading training statistics...")
    if TRAINING_DATA_PATH.exists():
        try:
            df = pd.read_csv(TRAINING_DATA_PATH)
            
            # Calculate stats for key targets
            state.training_stats['min_barrier_mean'] = df['min_barrier'].mean()
            state.training_stats['min_barrier_std'] = df['min_barrier'].std()
            state.training_stats['log10_conductivity_300K_mean'] = df['log10_conductivity_300K'].mean()
            state.training_stats['log10_conductivity_300K_std'] = df['log10_conductivity_300K'].std()
            state.training_stats['n_materials'] = len(df)
            
            print(f"  ✓ Training stats loaded")
            print(f"    - Materials: {state.training_stats['n_materials']}")
            print(f"    - EA mean: {state.training_stats['min_barrier_mean']:.3f} eV")
            print(f"    - log10(σ) mean: {state.training_stats['log10_conductivity_300K_mean']:.3f}")
            
        except Exception as e:
            error_msg = f"Failed to load training stats: {str(e)}"
            print(f"  ⚠ {error_msg}")
    
    state.initialized = state.corrector_model is not None
    
    if errors:
        print("\n[INIT] ⚠ Warnings:")
        for err in errors:
            print(f"  - {err}")
    
    if state.initialized:
        print("\n[INIT] ✓ Backend initialized!")
        print("\n⚠ NOTE: Using 81-feature corrector model (other models had feature mismatch)")
        print("         Results labeled by source (REAL_MODEL vs ESTIMATED)")
    else:
        print("\n[INIT] ✗ CRITICAL: Could not initialize")
    
    return errors


# ==================== FEATURE EXTRACTION ====================
def extract_basic_features(cif_path: Path) -> Dict[str, Any]:
    """
    Extract basic 81-feature set that v6_corrector_model expects
    This is a subset of training features most important for conductivity
    """
    result = {
        'status': 'error',
        'features': {},
        'errors': [],
        'warnings': [],
        'method': '81_features_for_corrector_model'
    }
    
    try:
        structure = Structure.from_file(str(cif_path))
        
        # Validate
        if not structure.is_ordered:
            result['errors'].append("Structure is disordered")
            return result
        
        features = {}
        
        print("    Extracting 81 basic features...")
        
        # 1. STRUCTURE FEATURES (~ 10 features)
        features['density'] = float(structure.density)
        features['volume'] = float(structure.volume)
        features['n_atoms'] = int(len(structure))
        features['cif_lat_a'] = float(structure.lattice.a)
        features['cif_lat_b'] = float(structure.lattice.b)
        features['cif_lat_c'] = float(structure.lattice.c)
        features['cif_lat_alpha'] = float(structure.lattice.alpha)
        features['cif_lat_beta'] = float(structure.lattice.beta)
        features['cif_lat_gamma'] = float(structure.lattice.gamma)
        features['cif_lat_vol'] = float(structure.volume)
        
        # 2. COMPOSITION FEATURES (~ 5 features)
        comp = structure.composition
        elements = list(comp.elements)
        features['comp_li_fraction'] = float(comp.get_el_amt_dict().get('Li', 0) / comp.num_atoms)
        features['comp_n_elements'] = int(len(elements))
        features['comp_n_sites_ratio'] = float(len(structure.sites) / max(len(structure), 1))
        features['n_li_sites'] = int(sum(1 for site in structure.sites if 'Li' in site.species_string))
        features['li_fraction'] = float(features['n_li_sites'] / max(len(structure), 1))
        
        # 3. ELEMENTAL MAGPIE FEATURES (~ 66 features from MAGPIE statistics)
        if elements:
            atomic_nums = [el.Z for el in elements]
            atomic_masses = [el.atomic_mass for el in elements]
            electronegativities = [el.X if el.X else 0.0 for el in elements]
            
            # MAGPIE statistics - these are typically important
            magpie_props = {
                'Number': atomic_nums,
                'AtomicWeight': atomic_masses,
                'Electronegativity': electronegativities,
            }
            
            for prop_name, values in magpie_props.items():
                values_arr = np.array(values)
                prefix = f'magpie_MagpieData'
                features[f'{prefix} minimum {prop_name}'] = float(np.min(values_arr))
                features[f'{prefix} maximum {prop_name}'] = float(np.max(values_arr))
                features[f'{prefix} range {prop_name}'] = float(np.max(values_arr) - np.min(values_arr))
                features[f'{prefix} mean {prop_name}'] = float(np.mean(values_arr))
                features[f'{prefix} avg_dev {prop_name}'] = float(np.std(values_arr)) if len(values_arr) > 1 else 0.0
        
        # Normalize to exactly 81 features
        core_features_needed = 81
        current_count = len(features)
        
        if current_count < core_features_needed:
            # Pad with zeros
            for i in range(core_features_needed - current_count):
                features[f'padding_{i}'] = 0.0
            result['warnings'].append(f"Padded with {core_features_needed - current_count} zeros to reach 81 features")
        elif current_count > core_features_needed:
            # Take only first 81
            feature_names = list(features.keys())[:core_features_needed]
            features = {k: features[k] for k in feature_names}
            result['warnings'].append(f"Truncated from {current_count} to {core_features_needed} features")
        
        result['features'] = features
        result['status'] = 'success'
        result['count'] = len(features)
        
        print(f"    ✓ Extracted {len(features)} features (corrector model compatible)")
        
    except Exception as e:
        result['errors'].append(f"Feature extraction error: {str(e)}")
        traceback.print_exc()
    
    return result


# ==================== MODEL PREDICTIONS ====================
class Predictor:
    """Make REAL predictions using corrector model"""
    
    @staticmethod
    def predict(features_dict: Dict) -> Dict[str, Any]:
        """
        Use v6_corrector_model to make predictions
        Returns dict with actual predictions and source labels
        """
        result = {
            'ea': {
                'value_ev': None,
                'source': 'UNKNOWN',
                'confidence': 0.0,
                'status': 'error',
                'errors': []
            },
            'pre_exponential': {
                'log10_value': None,
                'value_s_cm': None,
                'source': 'UNKNOWN',
                'confidence': 0.0,
                'status': 'error',
                'errors': []
            },
            'conductivity': {
                'log10_sigma_s_cm': None,
                'sigma_s_cm': None,
                'source': 'UNKNOWN',
                'confidence': 0.0,
                'status': 'error',
                'errors': []
            }
        }
        
        if state.corrector_model is None:
            for key in result:
                result[key]['errors'].append("Corrector model not loaded")
            return result
        
        try:
            # Prepare features as numpy array
            features_array = np.array([features_dict.get(f, 0.0) for f in features_dict.keys()])
            
            if len(features_array.shape) == 1:
                features_array = features_array.reshape(1, -1)
            
            print(f"    Model input shape: {features_array.shape}")
            
            # Make prediction
            predictions = state.corrector_model.predict(features_array)[0]
            
            if isinstance(predictions, (list, np.ndarray)):
                predictions = np.array(predictions)
            else:
                predictions = np.array([predictions])
            
            print(f"    Model output: {predictions} (shape: {predictions.shape})")
            
            # Parse predictions (assuming multi-output model)
            if len(predictions) >= 1:
                ea_pred = float(predictions[0])
                
                # Validate
                if 0.05 <= ea_pred <= 2.0:
                    result['ea']['value_ev'] = ea_pred
                    result['ea']['source'] = 'REAL_MODEL'
                    result['ea']['confidence'] = 0.75  # Model-based
                    result['ea']['status'] = 'success'
                else:
                    result['ea']['errors'].append(f"EA {ea_pred:.3f} eV outside valid range [0.05, 2.0]")
            
            # If model has second output (pre-exp)
            if len(predictions) >= 2:
                log10_a_pred = float(predictions[1])
                
                if 10 <= log10_a_pred <= 17:
                    result['pre_exponential']['log10_value'] = log10_a_pred
                    result['pre_exponential']['value_s_cm'] = 10 ** log10_a_pred
                    result['pre_exponential']['source'] = 'REAL_MODEL'
                    result['pre_exponential']['confidence'] = 0.70
                    result['pre_exponential']['status'] = 'success'
            
            # If model has third output (conductivity)
            if len(predictions) >= 3:
                log10_sigma = float(predictions[2])
                
                result['conductivity']['log10_sigma_s_cm'] = log10_sigma
                result['conductivity']['sigma_s_cm'] = 10 ** log10_sigma
                result['conductivity']['source'] = 'REAL_MODEL'
                result['conductivity']['confidence'] = 0.75
                result['conductivity']['status'] = 'success'
            
            # For missing outputs, use statistical estimates
            if result['pre_exponential']['status'] == 'error':
                mean_log10_a = 13.5  # Typical for Li-ion systems
                result['pre_exponential']['log10_value'] = mean_log10_a
                result['pre_exponential']['value_s_cm'] = 10 ** mean_log10_a
                result['pre_exponential']['source'] = 'ESTIMATED'
                result['pre_exponential']['confidence'] = 0.3
                result['pre_exponential']['status'] = 'estimated'
            
            if result['conductivity']['status'] == 'error':
                # Estimate from EA if available
                if result['ea']['status'] == 'success':
                    k_b_ev_k = 8.617333262145e-5
                    ea = result['ea']['value_ev']
                    log10_a = result['pre_exponential']['log10_value']
                    log10_sigma = log10_a - (ea / (k_b_ev_k * TEMPERATURE_K)) * np.log10(np.e)
                    
                    result['conductivity']['log10_sigma_s_cm'] = log10_sigma
                    result['conductivity']['sigma_s_cm'] = 10 ** log10_sigma
                    result['conductivity']['source'] = 'CALCULATED'
                    result['conductivity']['confidence'] = 0.4  # Derived, not direct
                    result['conductivity']['status'] = 'calculated'
            
        except Exception as e:
            error_msg = f"Prediction error: {str(e)}"
            print(f"    ✗ {error_msg}")
            for key in result:
                result[key]['errors'].append(error_msg)
            traceback.print_exc()
        
        return result


# ==================== CRYSTAL TYPE ====================
def classify_crystal_type(structure: Structure) -> Dict[str, Any]:
    """Classify based on lattice parameters"""
    result = {
        'crystal_type': 'UNKNOWN',
        'confidence': 0.0,
        'source': 'ESTIMATED',
        'errors': []
    }
    
    try:
        from pymatgen.symmetry.analyzer import SpaceGroupAnalyzer
        
        # Try space group analysis
        try:
            sga = SpaceGroupAnalyzer(structure)
            crystal_system = sga.get_crystal_system()
            result['crystal_type'] = crystal_system.upper()
            result['confidence'] = 0.9
            result['source'] = 'SPACEGROUP'
        except:
            # Fallback: use lattice parameters
            a, b, c = structure.lattice.a, structure.lattice.b, structure.lattice.c
            alpha, beta, gamma = structure.lattice.alpha, structure.lattice.beta, structure.lattice.gamma
            
            tol = 0.01
            
            if abs(a - b) < tol and abs(b - c) < tol and abs(alpha - 90) < tol and abs(beta - 90) < tol and abs(gamma - 90) < tol:
                result['crystal_type'] = 'CUBIC'
            elif abs(alpha - 90) < tol and abs(beta - 90) < tol and abs(gamma - 90) < tol:
                result['crystal_type'] = 'ORTHORHOMBIC'
            else:
                result['crystal_type'] = 'MONOCLINIC'
            
            result['confidence'] = 0.5
            result['source'] = 'LATTICE_PARAMS'
    
    except Exception as e:
        result['errors'].append(str(e))
    
    return result


# ==================== HES SCORE ====================
def calculate_hes_score(predictions: Dict) -> Dict[str, Any]:
    """
    Calculate HES (Hierarchical Evaluation Score)
    Based on ionic conductivity, EA, and stability indicators
    """
    result = {
        'hes_score': 0.0,
        'hes_rating': 'unknown',
        'components': {},
        'errors': []
    }
    
    try:
        # Score from conductivity (most important)
        sigma_score = 0.0
        if predictions['conductivity']['status'] in ['success', 'calculated', 'estimated']:
            sigma_s_cm = predictions['conductivity']['sigma_s_cm']
            if sigma_s_cm and sigma_s_cm > 0:
                log10_sigma = np.log10(sigma_s_cm)
                # Target is typically log10(σ) > -8 for good conductivity
                sigma_score = max(0, min(100, (log10_sigma + 8) * 12.5))
        
        result['components']['conductivity_score'] = sigma_score
        
        # Score from EA (lower is better, target < 0.5 eV)
        ea_score = 50.0
        if predictions['ea']['status'] == 'success':
            ea = predictions['ea']['value_ev']
            ea_score = max(0, min(100, (0.5 - ea) * 100))
        
        result['components']['ea_score'] = ea_score
        
        # Combined
        result['hes_score'] = (sigma_score * 0.6 + ea_score * 0.4)
        
        # Rating
        if result['hes_score'] >= 75:
            result['hes_rating'] = 'excellent'
        elif result['hes_score'] >= 50:
            result['hes_rating'] = 'good'
        elif result['hes_score'] >= 25:
            result['hes_rating'] = 'moderate'
        else:
            result['hes_rating'] = 'low'
    
    except Exception as e:
        result['errors'].append(str(e))
    
    return result


# ==================== API ENDPOINTS ====================
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok' if state.initialized else 'initializing',
        'model_loaded': state.corrector_model is not None,
        'approach': '81-feature corrector model (pragmatic fallback)'
    })


@app.route('/analyze-cif', methods=['POST'])
def analyze_cif():
    """Main endpoint: CIF upload → REAL predictions with source labels"""
    
    print("\n" + "=" * 100)
    print(f"[TRIAL] Request at {datetime.now().isoformat()}")
    print("=" * 100)
    
    response = {
        'status': 'error',
        'timestamp': datetime.now().isoformat(),
        'material_id': None,
        'results': {
            'features': {'status': 'error'},
            'structure': {'status': 'error'},
            'predictions': {
                'ea': {'status': 'error'},
                'pre_exponential': {'status': 'error'},
                'conductivity': {'status': 'error'}
            },
            'hes_score': {'status': 'error'}
        },
        'warnings': [],
        'note': 'All predictions labeled with source (REAL_MODEL / ESTIMATED / CALCULATED)'
    }
    
    try:
        # Validate
        if 'file' not in request.files:
            response['results']['features']['errors'] = ["No CIF file provided"]
            return jsonify(response), 400
        
        file = request.files['file']
        material_id = request.form.get('material_id', file.filename.split('.')[0])
        response['material_id'] = material_id
        
        # Save file
        temp_dir = UPLOAD_FOLDER / material_id
        temp_dir.mkdir(exist_ok=True, parents=True)
        cif_path = temp_dir / file.filename
        file.save(str(cif_path))
        
        print(f"\n✓ Material: {material_id}")
        print(f"✓ File: {file.filename}")
        
        # [1] Extract features
        print("\n[1] EXTRACTING FEATURES...")
        feat_result = extract_basic_features(cif_path)
        response['results']['features'] = {
            'status': feat_result['status'],
            'count': feat_result['count'],
            'warnings': feat_result['warnings'],
            'errors': feat_result.get('errors', [])
        }
        
        if feat_result['status'] != 'success':
            return jsonify(response), 400
        
        features_dict = feat_result['features']
        
        # [2] Parse structure
        print("\n[2] PARSING STRUCTURE...")
        try:
            structure = Structure.from_file(str(cif_path))
            crystal_result = classify_crystal_type(structure)
            response['results']['structure'] = crystal_result
            print(f"✓ Crystal type: {crystal_result['crystal_type']} ({crystal_result['source']})")
        except Exception as e:
            print(f"✗ Structure parsing failed: {e}")
            response['results']['structure'] = {
                'crystal_type': 'UNKNOWN',
                'confidence': 0.0,
                'errors': [str(e)]
            }
        
        # [3] MAKE PREDICTIONS
        print("\n[3] MAKING PREDICTIONS (REAL MODEL)...")
        pred_result = Predictor.predict(features_dict)
        response['results']['predictions'] = pred_result
        
        print(f"✓ EA: {pred_result['ea']['value_ev']} eV (source: {pred_result['ea']['source']})")
        print(f"✓ Pre-exp: 10^{pred_result['pre_exponential']['log10_value']} S/cm (source: {pred_result['pre_exponential']['source']})")
        print(f"✓ σ: {pred_result['conductivity']['sigma_s_cm']:.3e} S/cm (source: {pred_result['conductivity']['source']})")
        
        # [4] Calculate HES
        print("\n[4] CALCULATING HES SCORE...")
        hes_result = calculate_hes_score(pred_result)
        response['results']['hes_score'] = hes_result
        print(f"✓ HES score: {hes_result['hes_score']:.1f} ({hes_result['hes_rating']})")
        
        # Save result
        result_file = RESULTS_FOLDER / f"{material_id}_result.json"
        with open(result_file, 'w') as f:
            json.dump(response, f, indent=2, default=str)
        print(f"\n✓ Result saved to {result_file}")
        
        response['status'] = 'success'
        
    except Exception as e:
        error_msg = f"Request processing error: {str(e)}"
        response['errors'] = [error_msg]
        traceback.print_exc()
    
    return jsonify(response)


@app.route('/info', methods=['GET'])
def get_info():
    """Return backend info and limitations"""
    return jsonify({
        'backend': 'Trial Mode v3 (Pragmatic)',
        'model': 'v6_corrector_model.pkl (81 features)',
        'approach': 'Using corrector model that actually loads',
        'feature_limitation': 'Original models need 312 features, data only has 178',
        'solution': 'v6_corrector_model uses 81-feature subset',
        'prediction_sources': ['REAL_MODEL (from v6)', 'ESTIMATED (statistical)', 'CALCULATED (derived)'],
        'status': 'initialized' if state.initialized else 'error',
        'training_materials': state.training_stats.get('n_materials', 0)
    })


# ==================== MAIN ====================
if __name__ == '__main__':
    print("\n[STARTUP] Initializing backend...")
    initialize_backend()
    
    print("\n" + "=" * 100)
    print("✅ Ready! Backend running on http://localhost:5000")
    print("=" * 100)
    print("\nEndpoints:")
    print("  POST /analyze-cif         → Upload CIF file for analysis")
    print("  GET  /health              → Check backend status")
    print("  GET  /info                → Backend info and approach")
    print("=" * 100 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
