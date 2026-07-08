@echo off
cd /d "%~dp0"
set VENV_PYTHON=%~dp0..\.venv\Scripts\python.exe

if not exist "%VENV_PYTHON%" (
    echo Virtual environment tidak ditemukan.
    echo Silakan jalankan: python -m venv ..\.venv
    pause
    exit /b 1
)

echo Menjalankan test Django...
"%VENV_PYTHON%" manage.py test

if errorlevel 1 (
    echo.
    echo Test gagal.
) else (
    echo.
    echo Test berhasil.
)

pause
