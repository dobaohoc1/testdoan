# 🚀 Quick Setup Android - Run này để setup nhanh!

Write-Host "📱 ThucdonAI - Android Setup Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Node.js OK" -ForegroundColor Green
Write-Host ""

# Install Capacitor
Write-Host "📦 Installing Capacitor..." -ForegroundColor Yellow
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
Write-Host "🔧 Initializing Capacitor..." -ForegroundColor Yellow
Write-Host "Please answer the following questions:" -ForegroundColor Cyan
Write-Host "  App name: ThucdonAI" -ForegroundColor Cyan
Write-Host "  App package ID: com.thucdonai.app" -ForegroundColor Cyan
Write-Host "  Web asset directory: dist" -ForegroundColor Cyan
npx cap init

# Install Android platform
Write-Host "📱 Installing Android platform..." -ForegroundColor Yellow
npm install @capacitor/android
npx cap add android

# Install useful plugins
Write-Host "🔌 Installing native plugins..." -ForegroundColor Yellow
npm install @capacitor/camera @capacitor/local-notifications @capacitor/status-bar @capacitor/splash-screen

# Build web
Write-Host "🏗️  Building web app..." -ForegroundColor Yellow
npm run build

# Sync to Android
Write-Host "🔄 Syncing to Android..." -ForegroundColor Yellow
npx cap sync android

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open Android Studio: npx cap open android" -ForegroundColor White
Write-Host "  2. Click Run (▶️) button to test on emulator" -ForegroundColor White
Write-Host "  3. Or connect your phone and run on device" -ForegroundColor White
Write-Host ""
Write-Host "For development with live reload:" -ForegroundColor Cyan
Write-Host "  1. Get your IP: ipconfig" -ForegroundColor White
Write-Host "  2. Edit capacitor.config.ts" -ForegroundColor White
Write-Host "  3. npx cap sync android" -ForegroundColor White
Write-Host ""
Write-Host "Full guide: ANDROID_SETUP_GUIDE.md" -ForegroundColor Yellow
