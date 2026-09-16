@echo off
cd /d "%~dp0.."
echo ============================================
echo   DormTool Quick Test (site consistency)
echo ============================================
echo.
call npm test
echo.
echo ============================================
echo   Done. All green above means it passed.
echo   Any red FAIL lines list real issues on the
echo   live site (missing nav entries, broken
echo   redirects, sitemap gaps, etc) - nothing
echo   here gets auto-fixed.
echo ============================================
pause
