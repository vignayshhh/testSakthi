@echo off
echo 🚀 SakthiCare GitHub Actions APK Builder
echo.
echo STEP 1: Create GitHub Repository
echo 1. Go to: https://github.com/new
echo 2. Repository name: sakthicare  
echo 3. Make it PUBLIC
echo 4. Click "Create repository"
echo.
echo STEP 2: Enter your GitHub username:
set /p username="Your GitHub username: "
echo.
echo STEP 3: Pushing code to GitHub...
git remote set-url origin https://github.com/%username%/sakthicare.git
git push -u origin main
echo.
echo ✅ Code pushed successfully!
echo.
echo STEP 4: Build APK
echo 1. Go to your GitHub repository
echo 2. Click "Actions" tab
echo 3. Click "Build SakthiCare APK" workflow
echo 4. Click "Run workflow"
echo 5. Wait 5-10 minutes
echo 6. Download APK from artifacts
echo.
echo 🎉 Your APK will be ready soon!
pause
