# IonCast - Advanced Material Ranking & Prediction Framework

A comprehensive machine learning framework for predicting and ranking ionic materials with applications to lithium-based compounds. Combines HES (Heuristic Entropy Sorting), DRF (Dynamic Ranking Framework), and M3GNet surrogate models for material discovery and optimization.

## Overview

IonCast integrates multiple computational approaches to:

- **Rank Materials** using multi-criteria frameworks
- **Predict Properties** via neural network surrogate models
- **Analyze Ionic Compounds** with focus on lithium batteries
- **Generate Finite Displacement Features** for enhanced predictions
- **Validate Results** through comprehensive testing and reporting

## Project Structure

```
├── Framework Files
│   ├── final_integrated_hes_drf_composite.py      # Main integrated ranking framework
│   ├── material_ranking_framework.py              # Core ranking algorithms
│   ├── trial_mode_backend_final.py               # Trial mode API
│   ├── surrogate_model_v5_fixed.ipynb            # M3GNet surrogate model
│   ├── HES_Framework_v2_final.ipynb              # HES framework notebook
│   └── Framework_Demo.ipynb                       # Interactive demo
│
├── Datasets
│   ├── lithium_dataset_full_cleaned.csv          # Cleaned lithium dataset
│   ├── datasets/v5_merged_training_dataset.csv   # Training data
│   ├── datasets/v5_300plus_features_cache.csv    # Feature cache
│   └── Obliex_cifs/                              # CIF structure files
│
├── Results & Outputs
│   ├── ranking_results/                          # Generated rankings & reports
│   ├── pipeline_outputs/                         # Pipeline outputs
│   ├── trial_results/                            # Trial mode results
│   └── trial_uploads/                            # Uploaded trial data
│
├── Utilities & Scripts
│   ├── run_framework.py                          # Main framework runner
│   ├── run_full_dataset_v2.py                    # Full dataset processing
│   ├── run_trial_mode.py                         # Trial mode runner
│   ├── generate_drf_reports.py                   # Report generation
│   ├── m3gnet_finite_displacement_features.py    # Feature generation
│   └── useTrialModeAPI.js                        # JavaScript API client
│
└── Documentation
    ├── MATERIAL_RANKING_WORKFLOW.md              # Workflow guide
    ├── MODEL_WORKFLOW_DOCUMENTATION.md           # Model documentation
    └── TRIAL_MODE_GUIDE.md                       # Trial mode usage guide
```

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/SaiSubodh27/IonCast.git
cd IonCast

# Install dependencies
pip install -r requirements.txt
```

### Trial Mode (Quick Test)

```bash
# Run trial mode with sample data
python run_trial_mode.py
```

### Full Framework

```bash
# Run complete material ranking analysis
python run_framework.py
```

### Generate Reports

```bash
# Generate DRF reports
python generate_drf_reports.py

# Update notebook with results
python update_hes_notebook_report.py
```

## Key Components

### 1. **HES Framework** (Heuristic Entropy Sorting)

- Multi-criteria material ranking
- Entropy-based weighting
- Flexible configuration for different material classes

### 2. **DRF** (Dynamic Ranking Framework)

- Real-time ranking updates
- Acceptance criteria filtering
- Statistical analysis and diagnostics

### 3. **M3GNet Surrogate Model**

- Neural network-based property prediction
- Finite displacement feature calculation
- Fast inference for material screening

### 4. **Trial Mode**

- User-friendly API for quick predictions
- Batch processing capabilities
- JSON-based input/output

## Features

✅ Multi-criteria material ranking  
✅ Neural network surrogate models  
✅ Finite displacement feature generation  
✅ Comprehensive result reporting  
✅ Trial mode for quick testing  
✅ RESTful API support  
✅ Notebook-based exploration  
✅ Batch processing capabilities

## Documentation

- **MATERIAL_RANKING_WORKFLOW.md** - Complete workflow documentation
- **MODEL_WORKFLOW_DOCUMENTATION.md** - Model architecture and training
- **TRIAL_MODE_GUIDE.md** - Trial mode usage and examples

## Requirements

- Python 3.8+
- PyTorch
- TensorFlow
- Scikit-learn
- Pandas & NumPy
- M3GNet dependencies

See `requirements.txt` for full dependencies.

## Usage Examples

### Interactive Notebooks

1. **Framework_Demo.ipynb** - Interactive demonstration of the full pipeline
2. **HES_Framework_v2_final.ipynb** - HES framework walkthrough
3. **surrogate_model_v5_fixed.ipynb** - Surrogate model training and validation

### Python API

```python
from final_integrated_hes_drf_composite import IntegratedRankingFramework

# Initialize framework
framework = IntegratedRankingFramework()

# Run analysis
results = framework.rank_materials(dataset_path, criteria_config)

# Generate reports
framework.generate_reports(results)
```

### Trial Mode API

```bash
# Start API server
python trial_mode_backend_final.py

# Access via JavaScript or HTTP requests
```

## Results

All ranking results are stored in `ranking_results/` with:

- **CSV files** - Ranked materials and statistics
- **JSON files** - Diagnostics and detailed metrics
- **Reports** - Summary statistics and analysis

## License

[Specify your license here]

## Author

**Sai Subodh**  
GitHub: [@SaiSubodh27](https://github.com/SaiSubodh27)

## Acknowledgments

- M3GNet framework for neural network potential
- PyMatGen community for materials informatics tools
- Lithium battery research community

---

For questions or issues, please open an issue on GitHub or contact the maintainer.
