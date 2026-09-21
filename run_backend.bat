@echo off
echo ============================================================
echo Starting AI-PMP Backend Server (FastAPI + ML Models)
echo ============================================================
cd /d "%~dp0"
.\.venv\Scripts\python.exe backend\run.py
pause
