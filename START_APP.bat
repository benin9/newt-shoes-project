@echo off
echo.
echo ========================================
echo   NEWT SHOES & CLEAN - START APPLICATION
echo ========================================
echo.

REM Cek apakah Node.js installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak ditemukan!
    echo.
    echo Silakan install Node.js dari: https://nodejs.org/
    echo Pilih versi LTS (v20.x atau lebih baru)
    echo.
    echo Setelah install, restart terminal dan jalankan script ini lagi.
    pause
    exit /b 1
)

echo [OK] Node.js terdeteksi!
node --version
npm --version
echo.

REM Cek MySQL
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MySQL tidak ditemukan di PATH
    echo Pastikan MySQL sudah running di background
    echo.
)

REM Start Backend
echo [1/2] Menginstall dependencies Backend...
cd backend
call npm install --no-save
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gagal install backend dependencies!
    pause
    exit /b 1
)

echo.
echo [*] BACKEND akan dimulai...
echo     - Server: http://localhost:5000
echo     - Pastikan .env sudah ada dengan MIDTRANS_SERVER_KEY
echo.
start "Backend Server" cmd /k "npm run dev"

timeout /t 3

REM Start Frontend
cd ..\frontend
echo [2/2] Menginstall dependencies Frontend...
call npm install --no-save
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gagal install frontend dependencies!
    pause
    exit /b 1
)

echo.
echo [*] FRONTEND akan dimulai...
echo     - URL: http://localhost:3000
echo.
start "Frontend App" cmd /k "npm run dev"

echo.
echo ========================================
echo [OK] Aplikasi dimulai!
echo ========================================
echo.
echo Tunggu 5-10 detik agar kedua server siap...
echo.
echo BACKEND:  http://localhost:5000
echo FRONTEND: http://localhost:3000
echo.
pause
