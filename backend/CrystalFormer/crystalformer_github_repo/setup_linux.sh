#!/usr/bin/env bash
# One-time setup on a Linux machine with Docker + NVIDIA Container Toolkit (e.g. an A100 server).
#   bash setup_linux.sh
set -euo pipefail
cd "$(dirname "$0")"
IMAGE="${IMAGE:-main/crystalframer:latest}"
REPO_URL="https://github.com/omron-sinicx/crystalframer"   # authors' code; check this is the repo you cloned

command -v docker >/dev/null || { echo "docker not found"; exit 1; }
mkdir -p inputs outputs weights

[ -d crystalframer/.git ] || git clone "$REPO_URL" crystalframer

# The authors' Dockerfile uses Ubuntu 20.04, where the deadsnakes PPA no longer provides Python 3.11 -> use 22.04.
DF=crystalframer/docker/pytorch21_cuda121/Dockerfile
if grep -q "ubuntu20.04" "$DF"; then cp "$DF" "$DF.bak"; sed -i 's/ubuntu20.04/ubuntu22.04/' "$DF"; fi

docker build -t "$IMAGE" crystalframer/docker/pytorch21_cuda121
# thin layer: pandas 3.x in that image needs numpy 2, so pin pandas 2.2.3 / numpy 1.26.4
docker build -t "$IMAGE" --build-arg "BASE=$IMAGE" patch

echo; echo "== checkpoints expected in ./weights =="
for f in mp_e_form.ckpt mp_bandgap.ckpt mp_bulk_modulus.ckpt mp_shear_modulus.ckpt; do
  [ -f "weights/$f" ] && echo "  ok       $f" || echo "  MISSING  $f"
done

echo; echo "== GPU / environment check inside the container =="
docker run --rm --gpus all -v "$PWD":/workspace "$IMAGE" python /workspace/check_env.py
