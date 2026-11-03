#!/usr/bin/env bash
# Alternative when Docker is NOT available (conda + pip). NOT tested by the author.
#   bash setup_conda.sh
# Needs: conda, git, an NVIDIA driver supporting CUDA 12.1, and the CUDA 12.1 toolkit headers for cupy
# (on clusters: `module load cuda/12.1`; otherwise see README.md, section "No Docker").
set -euo pipefail
cd "$(dirname "$0")"
ENV_NAME="${ENV_NAME:-crystalformer}"
conda create -y -n "$ENV_NAME" python=3.11
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate "$ENV_NAME"
pip install -r requirements.txt
[ -d crystalframer/.git ] || git clone https://github.com/omron-sinicx/crystalframer crystalframer
mkdir -p inputs outputs weights
python check_env.py
echo
echo "To predict:"
echo "  conda activate $ENV_NAME"
echo "  export CF_REPO_DIR=\$PWD/crystalframer CF_WEIGHTS_DIR=\$PWD/weights"
echo "  python predict_5_properties.py --input inputs --output outputs/predictions.csv --batch-size 32"
