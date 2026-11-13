@echo off
echo ===================================================
echo     TERRATWIN - NASA PLANETARY INTELLIGENCE PLATFORM
echo ===================================================
echo.
echo Starting FastAPI Backend Service on http://localhost:8000 ...
start "TerraTwin Backend (FastAPI)" cmd /k "python -m uvicorn backend.app.main:app --port 8000 --reload"

echo Starting Vite React Frontend on http://localhost:3000 ...
start "TerraTwin Frontend (Vite)" cmd /k "npm run dev"

echo.
echo TerraTwin services initialized!
echo Open your browser at http://localhost:3000
echo ===================================================
pause
