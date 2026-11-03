# One-time check/build for Windows 11.   powershell -ExecutionPolicy Bypass -File .\setup.ps1
# Uses your EXISTING clone and checkpoints: nothing is cloned or downloaded.
# "Continue": Windows PowerShell 5.1 turns docker output on stderr into fatal errors under "Stop"; exit codes are checked explicitly below
$ErrorActionPreference = "Continue"
. "$PSScriptRoot\common.ps1"
Set-Location $Project

Write-Host "== 1/5  Host tools ==" -ForegroundColor Cyan
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "docker not found. Install Docker Desktop (see README_WINDOWS.md)." }
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
    nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader
} else { Write-Warning "nvidia-smi not found: install the NVIDIA driver on Windows." }
docker info *> $null
if ($LASTEXITCODE -ne 0) { throw "Docker is not running. Start Docker Desktop and wait for 'Engine running'." }

Write-Host "== 2/5  Folders ==" -ForegroundColor Cyan
foreach ($d in "inputs", "outputs") { New-Item -ItemType Directory -Force -Path (Join-Path $Project $d) | Out-Null }
Write-Host "mounted    : $Root  (the only folder the container can see)"
Write-Host "clone       : $RepoHost"
Write-Host "checkpoints : $WeightsHost"

if (Test-Path (Join-Path $RepoHost "torch_scatter.py")) {
    Write-Warning "Found torch_scatter.py inside the clone. If the Docker image has the real torch_scatter, this file would shadow it. If predictions fail on import, move it out of the clone."
}

Write-Host "== 3/5  Checkpoints ==" -ForegroundColor Cyan
$missing = $false
foreach ($f in $CkptNames) {
    if (Test-Path (Join-Path $WeightsHost $f)) { Write-Host "  ok       $f" } else { Write-Host "  MISSING  $f" -ForegroundColor Yellow; $missing = $true }
}
if ($missing) {
    Write-Warning "Expected names not all found. Either copy/rename the files in that folder, or point to your folder:"
    Write-Host '  $env:CF_WEIGHTS_HOST = "D:\where\your\ckpts\are"'
    if (Test-Path $WeightsHost) { Write-Host "  .ckpt files actually in $WeightsHost :"; Get-ChildItem $WeightsHost -Filter *.ckpt | ForEach-Object { "    " + $_.Name } }
}

Write-Host "== 4/5  Docker image ($Image) ==" -ForegroundColor Cyan
docker image inspect $Image *> $null
if ($env:FORCE_REBUILD -eq "1" -or $LASTEXITCODE -ne 0) {
    Push-Location (Join-Path $RepoHost "docker\pytorch21_cuda121")
    docker build -t $Image .
    $rc = $LASTEXITCODE; Pop-Location
    if ($rc -ne 0) { throw "docker build failed (see output above)" }
} else { Write-Host "image already built (set `$env:FORCE_REBUILD=1 to rebuild)" }

Write-Host "== 5/5  GPU smoke test inside the container ==" -ForegroundColor Cyan
docker @DockerBase $Image python "$ProjectCt/smoke_test.py"
if ($LASTEXITCODE -ne 0) { Write-Warning "Smoke test failed: see Troubleshooting in README_WINDOWS.md" }
Write-Host "`nDone. Put .cif files in inputs\ and run  .\run.ps1" -ForegroundColor Green
