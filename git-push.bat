@echo off
setlocal enabledelayedexpansion

echo.
echo ===============================================
echo          DiamondLabStore Git Push Script
echo ===============================================
echo.

REM Check if commit message was provided
if "%~1"=="" (
    set /p "commit_message=Enter commit message: "
) else (
    set "commit_message=%*"
)

echo.
echo 📝 Commit message: !commit_message!
echo.

REM Check git status first
echo 🔍 Checking git status...
git status --porcelain > temp_status.txt
set /a file_count=0
for /f %%i in (temp_status.txt) do set /a file_count+=1
del temp_status.txt

if !file_count! == 0 (
    echo ✅ No changes to commit. Working tree clean.
    goto :end
)

echo 📦 Adding all changes...
git add .
if errorlevel 1 (
    echo ❌ Error: Failed to add files
    goto :error
)

echo ✅ Files added successfully

echo 💾 Committing changes...
git commit -m "!commit_message!"
if errorlevel 1 (
    echo ❌ Error: Failed to commit changes
    goto :error
)

echo ✅ Changes committed successfully

echo 🚀 Pushing to remote repository...
git push origin main
if errorlevel 1 (
    echo ❌ Error: Failed to push to remote
    goto :error
)

echo.
echo ✅ ================================
echo ✅  Successfully pushed to GitHub!
echo ✅ ================================
echo.
goto :end

:error
echo.
echo ❌ ================================
echo ❌  Git operation failed!
echo ❌ ================================
echo.
exit /b 1

:end
echo Press any key to continue...
pause > nul 