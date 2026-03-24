@echo off
echo ==========================================
echo   MovieTime - Starting Full Stack App
echo ==========================================

echo.
echo [1/2] Starting Django Backend...
start "Django Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt && python seed.py && python manage.py runserver"

timeout /t 4 /nobreak > nul

echo [2/2] Starting React Frontend...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm start"

echo.
echo ==========================================
echo  Backend  : http://localhost:8000
echo  Frontend : http://localhost:3000
echo ==========================================
pause
