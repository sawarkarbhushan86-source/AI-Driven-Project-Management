@echo off
echo ============================================================
echo Launching AI-Driven Project Management Platform
echo ============================================================
echo 1. Launching Backend on http://localhost:8000 ...
start "AI-PMP Backend" cmd /k "run_backend.bat"

echo 2. Launching Frontend on http://localhost:5173 ...
start "AI-PMP Frontend" cmd /k "run_frontend.bat"

echo.
echo Platform launched!
echo - Web Dashboard: http://localhost:5173
echo - Backend API & Docs: http://localhost:8000/docs
echo ============================================================
