@echo off
echo 🚀 Starting deployment process...

REM Check if GitHub CLI is installed
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI is not installed. Please install it first:
    echo    Windows: winget install GitHub.cli
    echo    Or download from: https://cli.github.com/
    pause
    exit /b 1
)

REM Check if user is authenticated
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please authenticate with GitHub first:
    echo    gh auth login
    pause
    exit /b 1
)

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing git repository...
    git init
)

REM Add all files
echo 📝 Adding files to git...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo ℹ️  No changes to commit.
) else (
    echo 💾 Committing changes...
    for /f "tokens=*" %%i in ('powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set timestamp=%%i
    git commit -m "Deploy: Update logistics website %timestamp%"
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🌐 Creating GitHub repository...
    gh repo create logistics-website --public --description "BLACK SEA STAR Logistics Website with Admin Panel"
    for /f "tokens=*" %%i in ('gh api user --jq .login') do set username=%%i
    git remote add origin https://github.com/%username%/logistics-website.git
)

REM Push to GitHub
echo ⬆️  Pushing to GitHub...
git push -u origin main

echo ✅ Deployment initiated!
echo 🌐 Your website will be available at:
for /f "tokens=*" %%i in ('gh api user --jq .login') do echo    https://%%i.github.io/logistics-website
echo.
echo 📋 Next steps:
echo    1. Go to your repository settings
echo    2. Enable GitHub Pages with GitHub Actions source
echo    3. Wait for the deployment to complete
echo.
echo ⏱️  Deployment usually takes 2-5 minutes.
pause
