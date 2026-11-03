# Shared settings, dot-sourced by setup.ps1 and run.ps1. Not meant to be run directly.
#
# Expected layout (names of the new folder are up to you):
#   Model\
#     CrystalFormer\crystalframer\             <- authors' clone
#     CrystalFormer\crystalframer_weights\     <- checkpoints
#     <new folder>\                            <- THESE scripts, plus inputs\ and outputs\
# The container mounts ONLY  Model\  (as /workspace), so it can see all three and nothing else on your PC.
$Project = $PSScriptRoot
$Root    = Split-Path $Project -Parent
$Image   = if ($env:IMAGE) { $env:IMAGE } else { "main/crystalframer:latest" }

function ToCt([string]$hostPath) {      # Windows path under $Root -> path inside the container
    $rel = $hostPath.Substring($Root.Length).TrimStart("\") -replace "\\", "/"
    if ($rel) { "/workspace/$rel" } else { "/workspace" }
}

# --- the clone (override with $env:CF_REPO_HOST) ---
if ($env:CF_REPO_HOST) { $RepoHost = $env:CF_REPO_HOST }
else {
    $hit = Get-ChildItem -Path $Root -Recurse -Depth 5 -Directory -Filter "pytorch21_cuda121" -ErrorAction SilentlyContinue |
           Where-Object { $_.Parent.Name -eq "docker" } | Select-Object -First 1
    if (-not $hit) { throw "Crystalformer clone not found under $Root. Set `$env:CF_REPO_HOST to the folder that contains 'docker' and 'params'." }
    $RepoHost = $hit.Parent.Parent.FullName
}

# --- the checkpoints (override with $env:CF_WEIGHTS_HOST; folders outside Model\ are mounted read-only) ---
$WeightsMount = @()
if ($env:CF_WEIGHTS_HOST) {
    $WeightsHost = $env:CF_WEIGHTS_HOST; $WeightsCt = "/weights"
    $WeightsMount = @("-v", "${WeightsHost}:/weights:ro")
} else {
    $hit = Get-ChildItem -Path $Root -Recurse -Depth 5 -File -Filter "mp_e_form.ckpt" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($hit) { $WeightsHost = $hit.DirectoryName } else { $WeightsHost = Join-Path $Root "CrystalFormer\crystalframer_weights" }
    $WeightsCt = ToCt $WeightsHost
}

$RepoCt    = ToCt $RepoHost
$ProjectCt = ToCt $Project
$CkptNames = "mp_e_form.ckpt", "mp_bandgap.ckpt", "mp_bulk_modulus.ckpt", "mp_shear_modulus.ckpt"

$DockerBase = @("run", "--rm", "--gpus=all", "--shm-size=2g", "-v", "${Root}:/workspace") + $WeightsMount +
              @("-w", $RepoCt, "-e", "CF_REPO_DIR=$RepoCt", "-e", "CF_WEIGHTS_DIR=$WeightsCt")
