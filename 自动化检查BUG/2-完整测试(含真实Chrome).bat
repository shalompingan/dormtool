@echo off
cd /d "%~dp0.."
echo ============================================
echo   Step 1: Site consistency check (fast)
echo ============================================
echo.
call npm test
echo.
echo ============================================
echo   Step 2: Browser tests (a real Chrome window
echo   will pop up and click around - this is normal)
echo ============================================
echo.
call npm run test:e2e
echo.
echo ============================================
echo   Done. All green above means it passed.
echo ============================================
pause
