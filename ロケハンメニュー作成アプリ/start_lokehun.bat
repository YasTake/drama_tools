@echo off
cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install from https://www.python.org
    pause
    exit /b
)

set PORT=8080
netstat -an | find ":8080 " >nul 2>&1
if %errorlevel% equ 0 set PORT=8081

start "" cmd /c "timeout /t 2 >nul && start http://localhost:%PORT%/lokehun_menu.html"

echo.
echo  ========================================
echo   Lokehun Menu App is running...
echo   URL: http://localhost:%PORT%/lokehun_menu.html
echo.
echo   To STOP: close this window.
echo  ========================================
echo.

python -m http.server %PORT%
