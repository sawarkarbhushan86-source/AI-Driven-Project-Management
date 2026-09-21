@echo off
echo ============================================================
echo Starting AI-PMP Frontend (React + Vite + Tailwind)
echo ============================================================
cd /d "%~dp0frontend"
set PATH=C:\Users\Bhushan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%
set NODE_EXE=C:\Users\Bhushan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe

"%NODE_EXE%" node_modules\vite\bin\vite.js --host
