# .\run.ps1                          predict for everything in inputs\ -> outputs\predictions.csv
# .\run.ps1 predict --batch-size 2   with options (.\run.ps1 predict --help)
# .\run.ps1 ehullmodel               CrystalFormer ehull model only on inputs\ -> outputs\ehull_model.csv (no API key)
# .\run.ps1 ehull                    energy above hull for outputs\predictions.csv (needs mp_api_key.txt)
# .\run.ps1 shell | test-gpu | diag | patch | tune | ckpt
param(
    [string]$Command = "predict",
    [Parameter(ValueFromRemainingArguments = $true)] [string[]]$Rest
)
. "$PSScriptRoot\common.ps1"
switch ($Command) {
    "predict"  { docker @DockerBase $Image python "$ProjectCt/predict_5_properties.py" `
                    --input "$ProjectCt/inputs" --output "$ProjectCt/outputs/predictions.csv" @Rest }
    "shell"    { docker @DockerBase -it $Image /bin/bash }
    "patch"    { docker build -t $Image --build-arg "BASE=$Image" "$Project\patch" }
    "tune"     { docker @DockerBase $Image python "$ProjectCt/tune_check.py" --input "$ProjectCt/inputs" --ref "$ProjectCt/selected_50_materials.csv" @Rest }
    "ehullmodel" { docker @DockerBase $Image python "$ProjectCt/predict_ehull_only.py" --input "$ProjectCt/inputs" --output "$ProjectCt/outputs/ehull_model.csv" @Rest }
    "ehull"    { docker @DockerBase $Image python "$ProjectCt/ehull_from_mp.py" --input "$ProjectCt/outputs/predictions.csv" --output "$ProjectCt/outputs/predictions_with_ehull.csv" @Rest }
    "ckpt"     { docker @DockerBase $Image python "$ProjectCt/inspect_ckpt.py" }
    "diag"     { docker @DockerBase $Image python "$ProjectCt/diag_env.py" }
    "test-gpu" { docker @DockerBase $Image python "$ProjectCt/smoke_test.py" }
    default    { Write-Error "unknown command: $Command (use predict | shell | test-gpu | diag | patch | tune | ckpt | ehull | ehullmodel)" }
}
