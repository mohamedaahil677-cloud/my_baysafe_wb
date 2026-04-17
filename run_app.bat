
@echo off
TITLE BaySafe DMS Runner
setlocal
cd /d %~dp0

echo ==========================================
echo    BaySafe DMS - Dynamic Command Center
echo ==========================================

:: 1. Start Flask Backend
echo [1/2] Starting Production-Ready Backend...
:: Note: Using start to open in a new window so you can see logs
start "BaySafe Backend" cmd /k "cd /d backend && python -m pip install -r requirements.txt --quiet && python run.py"

:: 2. Start Vite Frontend
echo [2/2] Starting High-Aesthetics Frontend...
start "BaySafe Frontend" cmd /k "cd /d frontend && npm run dev"

echo.
echo ------------------------------------------
echo SERVICES ARE BOOTING UP
echo ------------------------------------------
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Note: If backend crashes, check for port 5000 conflicts.
echo ------------------------------------------
pause
