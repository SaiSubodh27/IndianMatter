@echo off
setlocal enabledelayedexpansion
title IonCast: Ionic Conductivity Predictor

echo ===============================================================================
echo                IONCAST: IONIC CONDUCTIVITY SURROGATE PREDICTOR
echo                     (OBLiEx Physics-Informed ML Architecture)
echo ===============================================================================
echo.

:: -----------------------------------------------------------------------------
:: 1. Dynamic Project Root Auto-Discovery (Portable for any user/drive)
:: -----------------------------------------------------------------------------
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT="

if exist "%SCRIPT_DIR%Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" (
    set "PROJECT_ROOT=%SCRIPT_DIR%"
    goto FOUND_ROOT
)
if exist "%SCRIPT_DIR%Surrogate_models\Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" (
    set "PROJECT_ROOT=%SCRIPT_DIR%Surrogate_models\"
    goto FOUND_ROOT
)
if exist "%SCRIPT_DIR%predict_ionic_conductivity.py" (
    set "PROJECT_ROOT=%SCRIPT_DIR%..\"
    goto FOUND_ROOT
)
if exist "%SCRIPT_DIR%..\Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" (
    set "PROJECT_ROOT=%SCRIPT_DIR%..\"
    goto FOUND_ROOT
)
if exist "%SCRIPT_DIR%Surrogate_models_Colab_Package\Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" (
    set "PROJECT_ROOT=%SCRIPT_DIR%Surrogate_models_Colab_Package\"
    goto FOUND_ROOT
)

:: If not found in immediate relative paths, search within script directory recursively
for /r "%SCRIPT_DIR%" %%F in (predict_ionic_conductivity.py) do (
    if exist "%%F" (
        for %%D in ("%%~dpF..") do set "PROJECT_ROOT=%%~fD\"
        goto FOUND_ROOT
    )
)

:: If still not found, check current working directory
if exist "%CD%\Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" (
    set "PROJECT_ROOT=%CD%\"
    goto FOUND_ROOT
)

echo [ERROR] Could not find predict_ionic_conductivity.py.
echo Location searched: %SCRIPT_DIR%
echo.
echo Please ensure the Ionic_Conductivity_Predictor folder is present.
echo.
pause
exit /b 1

:FOUND_ROOT
if not "%PROJECT_ROOT:~-1%"=="\" set "PROJECT_ROOT=%PROJECT_ROOT%\"
echo [Project Root] %PROJECT_ROOT%

:: -----------------------------------------------------------------------------
:: 2. Detect Working Python Environment
:: -----------------------------------------------------------------------------
set "PYTHON_EXE="

:: Check local virtual environments
if exist "%PROJECT_ROOT%.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%PROJECT_ROOT%.venv\Scripts\python.exe"
    goto VERIFY_PYTHON
)
if exist "%PROJECT_ROOT%venv\Scripts\python.exe" (
    set "PYTHON_EXE=%PROJECT_ROOT%venv\Scripts\python.exe"
    goto VERIFY_PYTHON
)
if exist "%SCRIPT_DIR%.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%SCRIPT_DIR%.venv\Scripts\python.exe"
    goto VERIFY_PYTHON
)
if exist "%SCRIPT_DIR%venv\Scripts\python.exe" (
    set "PYTHON_EXE=%SCRIPT_DIR%venv\Scripts\python.exe"
    goto VERIFY_PYTHON
)

:: Check python in system PATH
python -c "import sys; sys.exit(0)" >nul 2>nul
if %errorlevel% equ 0 (
    set "PYTHON_EXE=python"
    goto VERIFY_PYTHON
)

:: Check Python Launcher py -3 or py
py -3 -c "import sys; sys.exit(0)" >nul 2>nul
if %errorlevel% equ 0 (
    set "PYTHON_EXE=py -3"
    goto VERIFY_PYTHON
)
py -c "import sys; sys.exit(0)" >nul 2>nul
if %errorlevel% equ 0 (
    set "PYTHON_EXE=py"
    goto VERIFY_PYTHON
)

:: Check standard Python install directories
for %%P in (
    "%LOCALAPPDATA%\Programs\Python\Python313\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python310\python.exe"
    "%ProgramFiles%\Python313\python.exe"
    "%ProgramFiles%\Python312\python.exe"
    "%ProgramFiles%\Python311\python.exe"
    "%ProgramFiles%\Python310\python.exe"
    "C:\Python313\python.exe"
    "C:\Python312\python.exe"
    "C:\Python311\python.exe"
    "C:\Python310\python.exe"
    "%USERPROFILE%\anaconda3\python.exe"
    "%USERPROFILE%\miniconda3\python.exe"
    "C:\ProgramData\anaconda3\python.exe"
    "C:\ProgramData\miniconda3\python.exe"
) do (
    if exist %%P (
        %%P -c "import sys; sys.exit(0)" >nul 2>nul
        if !errorlevel! equ 0 (
            set "PYTHON_EXE=%%~P"
            goto VERIFY_PYTHON
        )
    )
)

echo.
echo [ERROR] No working Python installation was found on this computer.
echo.
echo To run this predictor, please install Python:
echo   1. Download installer from: https://www.python.org/downloads/
echo   2. IMPORTANT: Check the box "Add python.exe to PATH" during installation.
echo.
pause
exit /b 1

:VERIFY_PYTHON
echo [Environment ] Using Python: %PYTHON_EXE%
echo.

:: -----------------------------------------------------------------------------
:: 3. Check / Verify Python Packages
:: -----------------------------------------------------------------------------
echo [Notice] Checking required Python packages...
%PYTHON_EXE% -c "import pymatgen, matminer, lightgbm, joblib" >nul 2>nul
if %errorlevel% neq 0 (
    echo [Notice] Installing or verifying required packages...
    if exist "%PROJECT_ROOT%Ionic_Conductivity_Predictor\requirements.txt" (
        %PYTHON_EXE% -m pip install -r "%PROJECT_ROOT%Ionic_Conductivity_Predictor\requirements.txt"
    ) else (
        %PYTHON_EXE% -m pip install pymatgen matminer lightgbm xgboost catboost joblib scikit-learn pandas numpy matplotlib
    )
    if !errorlevel! neq 0 (
        echo [WARNING] Package installation encountered an issue. Will attempt to run anyway.
        echo.
    ) else (
        echo [Notice] Dependencies verified.
        echo.
    )
) else (
    echo [Notice] Dependencies verified.
    echo.
)

:MENU
echo -------------------------------------------------------------------------------
echo Please select an option:
echo   [1] Run Demo CIFs [LLZO, LGPS, Li3PO4, Na3PS4]
echo   [2] Run Top 10 High-Conductivity OBLiEx Candidates
echo   [3] Predict a Single CIF [Type or Drag-and-Drop file]
echo   [4] Predict All CIFs in a Folder
echo   [5] Run Full OBLiEx Experimental Dataset Benchmark [321 materials]
echo   [6] Exit
echo -------------------------------------------------------------------------------
set "CHOICE="
set /p "CHOICE=Enter choice (1-6): "

if defined CHOICE (
    set "CHOICE=!CHOICE:"=!"
    set "CHOICE=!CHOICE: =!"
)

if "%CHOICE%"=="1" goto RUN_DEMO
if "%CHOICE%"=="2" goto RUN_TOP10
if "%CHOICE%"=="3" goto RUN_SINGLE
if "%CHOICE%"=="4" goto RUN_FOLDER
if "%CHOICE%"=="5" goto RUN_OBLIEX_ALL
if "%CHOICE%"=="6" goto EXIT_PROMPT

echo.
echo [!] Invalid option selected. Please choose between 1 and 6.
echo.
pause
goto MENU

:RUN_DEMO
echo.
echo Running predictions on demo CIFs...
set "DEMO_DIR=%PROJECT_ROOT%Ionic_Conductivity_Predictor\demo_datasets\batch_cifs"
if not exist "%DEMO_DIR%" set "DEMO_DIR=%PROJECT_ROOT%demo_datasets\batch_cifs"

if not exist "%DEMO_DIR%" (
    echo [ERROR] Demo CIF directory not found at: "%DEMO_DIR%"
    echo.
    pause
    goto MENU
)

%PYTHON_EXE% "%PROJECT_ROOT%Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" --cif-dir "%DEMO_DIR%" --corrector --out "%PROJECT_ROOT%demo_results.csv"
if %errorlevel% equ 0 (
    echo.
    echo [DONE] Results exported to: %PROJECT_ROOT%demo_results.csv
) else (
    echo.
    echo [ERROR] Prediction failed. Please check error messages above.
)
goto FINISH

:RUN_TOP10
echo.
echo Running predictions on Top 10 High-Conductivity OBLiEx Candidates...
set "TOP10_DIR=%PROJECT_ROOT%Ionic_Conductivity_Predictor\demo_datasets\top_obliex_cifs"
if not exist "%TOP10_DIR%" set "TOP10_DIR=%PROJECT_ROOT%demo_datasets\top_obliex_cifs"

if not exist "%TOP10_DIR%" (
    echo [ERROR] Top 10 CIF directory not found at: "%TOP10_DIR%"
    echo.
    pause
    goto MENU
)

%PYTHON_EXE% "%PROJECT_ROOT%Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" --cif-dir "%TOP10_DIR%" --corrector --out "%PROJECT_ROOT%top10_obliex_results.csv"
if %errorlevel% equ 0 (
    echo.
    echo [DONE] Results exported to: %PROJECT_ROOT%top10_obliex_results.csv
) else (
    echo.
    echo [ERROR] Prediction failed. Please check error messages above.
)
goto FINISH

:RUN_SINGLE
echo.
echo Please drag-and-drop a .cif file here or type full path, then press Enter:
set "USER_CIF="
set /p "USER_CIF="

if defined USER_CIF (
    set "USER_CIF=!USER_CIF:"=!"
)

if not defined USER_CIF (
    echo [!] No file provided.
    echo.
    pause
    goto MENU
)

if not exist "!USER_CIF!" (
    echo [ERROR] File does not exist: !USER_CIF!
    echo.
    pause
    goto MENU
)

echo.
echo Predicting ionic conductivity for: !USER_CIF!
%PYTHON_EXE% "%PROJECT_ROOT%Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" --cif "!USER_CIF!" --corrector --out "%PROJECT_ROOT%single_prediction_results.csv"
if %errorlevel% equ 0 (
    echo.
    echo [DONE] Results exported to: %PROJECT_ROOT%single_prediction_results.csv
) else (
    echo.
    echo [ERROR] Prediction failed. Please check error messages above.
)
goto FINISH

:RUN_FOLDER
echo.
echo Please drag-and-drop a folder containing .cif files here and press Enter:
set "USER_FOLDER="
set /p "USER_FOLDER="

if defined USER_FOLDER (
    set "USER_FOLDER=!USER_FOLDER:"=!"
)

if not defined USER_FOLDER (
    echo [!] No folder provided.
    echo.
    pause
    goto MENU
)

if not exist "!USER_FOLDER!" (
    echo [ERROR] Folder does not exist: !USER_FOLDER!
    echo.
    pause
    goto MENU
)

echo.
echo Predicting ionic conductivity for all CIFs in: !USER_FOLDER!
%PYTHON_EXE% "%PROJECT_ROOT%Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" --cif-dir "!USER_FOLDER!" --corrector --out "%PROJECT_ROOT%folder_prediction_results.csv"
if %errorlevel% equ 0 (
    echo.
    echo [DONE] Results exported to: %PROJECT_ROOT%folder_prediction_results.csv
) else (
    echo.
    echo [ERROR] Prediction failed. Please check error messages above.
)
goto FINISH

:RUN_OBLIEX_ALL
echo.
echo Checking full OBLiEx dataset...
set "FULL_CIF_DIR=%PROJECT_ROOT%datasets\cifs"
if not exist "%FULL_CIF_DIR%" set "FULL_CIF_DIR=%PROJECT_ROOT%Ionic_Conductivity_Pipeline\data\cifs"

if not exist "%FULL_CIF_DIR%" (
    echo [INFO] Full OBLiEx 321 CIF dataset directory not found at default location.
    echo To run predictions on custom CIF folders, please use Option [4].
    echo.
    pause
    goto MENU
)

%PYTHON_EXE% "%PROJECT_ROOT%Ionic_Conductivity_Predictor\predict_ionic_conductivity.py" --cif-dir "%FULL_CIF_DIR%" --corrector --out "%PROJECT_ROOT%obliex_full_321_predictions.csv"
if %errorlevel% equ 0 (
    echo.
    echo [DONE] Full benchmark exported to: %PROJECT_ROOT%obliex_full_321_predictions.csv
) else (
    echo.
    echo [ERROR] Benchmark process exited with an error.
)
goto FINISH

:FINISH
echo.
echo ===============================================================================
echo Process finished! Summary CSV file saved in project folder.
echo ===============================================================================
echo.
pause
goto MENU

:EXIT_PROMPT
echo.
echo Exiting IonCast Predictor. Goodbye!
echo.
pause
exit /b 0
