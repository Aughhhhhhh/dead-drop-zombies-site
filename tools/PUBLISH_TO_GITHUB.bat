@echo off
setlocal EnableExtensions
cd /d "%~dp0\.."

echo Dead Drop Zombies - GitHub Publisher
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed or is not available in PATH.
  echo Install Git for Windows, reopen this file, and try again.
  pause
  exit /b 1
)

set /p REPO_URL=Paste the HTTPS URL of your EMPTY GitHub repository: 
if "%REPO_URL%"=="" (
  echo No repository URL was entered.
  pause
  exit /b 1
)

if not exist ".git" git init -b main
if errorlevel 1 goto :failed

git config user.name "Aughhhhhhh"
git config user.email "104948486+Aughhhhhhh@users.noreply.github.com"
git add -A

git diff --cached --quiet
if errorlevel 1 git commit -m "Publish Dead Drop Zombies"

git branch -M main
git remote remove origin >nul 2>&1
git remote add origin "%REPO_URL%"
if errorlevel 1 goto :failed

echo.
echo Pushing to GitHub. Git Credential Manager may open a browser sign-in.
git push -u origin main
if errorlevel 1 goto :failed

echo.
echo Success. The complete site is now in GitHub.
pause
exit /b 0

:failed
echo.
echo The publish operation failed. Read the Git error above.
pause
exit /b 1
