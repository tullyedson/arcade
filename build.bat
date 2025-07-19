@echo off
echo 🎮 Retro Arcade Build Script
echo ============================

echo.
echo Choose your build target:
echo 1. Windows Desktop App (Electron)
echo 2. iOS App (Capacitor)
echo 3. Android App (Capacitor)
echo 4. Progressive Web App (PWA)
echo 5. Install Dependencies Only
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto windows
if "%choice%"=="2" goto ios
if "%choice%"=="3" goto android
if "%choice%"=="4" goto pwa
if "%choice%"=="5" goto install
goto invalid

:install
echo.
echo 📦 Installing dependencies...
npm install
echo ✅ Dependencies installed successfully!
goto end

:windows
echo.
echo 🖥️ Building Windows Desktop App...
echo 📦 Installing dependencies...
npm install
echo 🚀 Building Windows installer...
npm run build:win
echo ✅ Windows app built successfully!
echo 📁 Check the 'dist' folder for your installer.
goto end

:ios
echo.
echo 📱 Setting up iOS App...
echo ⚠️  Note: iOS development requires macOS and Xcode
echo 📦 Installing dependencies...
npm install
echo 🔧 Adding iOS platform...
npx cap add ios
echo 🔄 Syncing web code...
npx cap sync
echo 🚀 Opening in Xcode...
npx cap open ios
echo ✅ iOS project opened in Xcode!
echo 📱 Build and run from Xcode.
goto end

:android
echo.
echo 🤖 Setting up Android App...
echo ⚠️  Note: Android development requires Android Studio
echo 📦 Installing dependencies...
npm install
echo 🔧 Adding Android platform...
npx cap add android
echo 🔄 Syncing web code...
npx cap sync
echo 🚀 Opening in Android Studio...
npx cap open android
echo ✅ Android project opened in Android Studio!
echo 📱 Build and run from Android Studio.
goto end

:pwa
echo.
echo 🌐 Setting up Progressive Web App...
echo 📦 Installing dependencies...
npm install
echo ✅ PWA setup complete!
echo 🌐 Deploy to any web server to use as PWA.
echo 📱 Users can install from browser menu.
goto end

:invalid
echo.
echo ❌ Invalid choice. Please run the script again.
goto end

:end
echo.
echo 🎉 Build process completed!
echo 📖 Check BUILD.md for detailed instructions.
pause 