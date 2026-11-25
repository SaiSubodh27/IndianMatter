#!/bin/sh
set -e

echo "[model-store] Syncing IndianMatter model artifacts from /opt/models -> /models ..."
mkdir -p /models
cp -rn /opt/models/. /models/ 2>/dev/null || cp -ru /opt/models/. /models/

echo "[model-store] Model inventory in /models:"
find /models -maxdepth 3 -type f | sort | head -n 50

# Write readiness marker
date -u +"%Y-%m-%dT%H:%M:%SZ" > /models/.ready
echo "[model-store] Ready. Keeping volume container alive."
exec tail -f /dev/null
