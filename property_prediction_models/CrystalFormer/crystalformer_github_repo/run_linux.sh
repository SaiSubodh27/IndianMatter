#!/usr/bin/env bash
# Usage (Docker route):
#   bash run_linux.sh                       predict everything in ./inputs  ->  ./outputs/predictions.csv
#   bash run_linux.sh predict --batch-size 32
#   bash run_linux.sh check                 environment check
#   bash run_linux.sh ehull                 energy above hull from the predictions (needs mp_api_key.txt)
set -euo pipefail
cd "$(dirname "$0")"
IMAGE="${IMAGE:-main/crystalframer:latest}"
CMD="${1:-predict}"; [ $# -gt 0 ] && shift
BASE=(docker run --rm --gpus all --shm-size=2g -v "$PWD":/workspace -w /workspace/crystalframer
      -e CF_REPO_DIR=/workspace/crystalframer -e CF_WEIGHTS_DIR=/workspace/weights)
case "$CMD" in
  predict) "${BASE[@]}" "$IMAGE" python /workspace/predict_5_properties.py \
             --input /workspace/inputs --output /workspace/outputs/predictions.csv --batch-size 32 "$@" ;;
  check)   "${BASE[@]}" "$IMAGE" python /workspace/check_env.py ;;
  ehull)   "${BASE[@]}" "$IMAGE" python /workspace/ehull_from_mp.py \
             --input /workspace/outputs/predictions.csv --output /workspace/outputs/predictions_with_ehull.csv "$@" ;;
  shell)   "${BASE[@]}" -it "$IMAGE" /bin/bash ;;
  *) echo "unknown command: $CMD (predict | check | ehull | shell)"; exit 1 ;;
esac
