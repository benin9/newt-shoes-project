@echo off
set "PROJECT_ROOT=%~dp0"
set "BACKEND_DIR=%PROJECT_ROOT%backend-django"
set "VENV_PYTHON=%PROJECT_ROOT%.venv\Scripts\python.exe"

if not exist "%VENV_PYTHON%" (
    echo Virtual environment tidak ditemukan di %VENV_PYTHON%.
    echo Silakan jalankan: python -m venv .venv
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%\manage.py" (
    echo File manage.py tidak ditemukan di %BACKEND_DIR%.
    pause
    exit /b 1
)

cd /d "%BACKEND_DIR%"
echo Menjalankan test Django dari backend...
"%VENV_PYTHON%" manage.py test

if errorlevel 1 (
    echo.
    echo Test gagal.
) else (
    echo.
    echo Test berhasil.
)

pause
