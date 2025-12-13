# 📱 HƯỚNG DẪN CHẠY TRÊN ANDROID - THUCDONAI

## 🎯 MỤC TIÊU
Chuyển đổi React web app thành **Android native app** sử dụng **Capacitor**

---

## 🚀 CÁCH 1: CAPACITOR (RECOMMEND)

### **Tại sao Capacitor?**
- ✅ Giữ nguyên code React hiện tại
- ✅ Có thể build APK để install
- ✅ Access native features (camera, notifications)
- ✅ Dễ setup hơn React Native

---

## 📋 BƯỚC 1: CÀI ĐẶT CAPACITOR

### 1.1. Install Capacitor
```bash
cd c:\Users\Administrator\Downloads\DoAn\an-ai-menu-mate-main

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init
```

**Khi chạy `npx cap init`, nhập:**
- **App name:** ThucdonAI
- **App package ID:** com.thucdonai.app (hoặc tên domain của bạn)
- **Web asset directory:** dist

### 1.2. Install Android platform
```bash
npm install @capacitor/android

# Add Android platform
npx cap add android
```

---

## 📋 BƯỚC 2: CONFIG VITE CHO CAPACITOR

### 2.1. Sửa `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ THÊM PHẦN NÀY CHO CAPACITOR
  base: './', // Quan trọng cho Capacitor
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
```

### 2.2. Sửa `capacitor.config.ts`

Tạo file `capacitor.config.ts` trong root:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thucdonai.app',
  appName: 'ThucdonAI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Cho development - comment out khi build production
    // url: 'http://192.168.1.16:8080', // IP máy bạn
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22c55e",
      showSpinner: false
    }
  }
};

export default config;
```

---

## 📋 BƯỚC 3: BUILD VÀ SYNC

### 3.1. Build web app
```bash
npm run build
```

### 3.2. Sync với Android
```bash
npx cap sync android
```

Lệnh này sẽ:
- Copy `dist/` folder vào Android project
- Update dependencies
- Generate Android project trong `android/` folder

---

## 📋 BƯỚC 4: MỞ ANDROID STUDIO

### 4.1. Mở project trong Android Studio
```bash
npx cap open android
```

Hoặc thủ công:
- Mở Android Studio
- File → Open
- Chọn folder `c:\Users\Administrator\Downloads\DoAn\an-ai-menu-mate-main\android`

### 4.2. Cài đặt Android Studio (nếu chưa có)

**Download:**
https://developer.android.com/studio

**Requirements:**
- Java JDK 11+
- Android SDK
- Android Emulator hoặc thiết bị thật

### 4.3. Chạy app

**Option 1: Emulator**
1. Trong Android Studio → Tools → Device Manager
2. Create Virtual Device (Pixel 5, Android 11+)
3. Click ▶️ Run button

**Option 2: Thiết bị thật**
1. Bật Developer Options trên điện thoại
2. Bật USB Debugging
3. Cắm USB vào máy tính
4. Android Studio sẽ detect
5. Click ▶️ Run

---

## 📋 BƯỚC 5: DEVELOPMENT WORKFLOW

### 5.1. Live Reload Development

**Terminal 1:** Chạy dev server
```bash
npm run dev
```

**Sửa `capacitor.config.ts`:**
```typescript
server: {
  url: 'http://192.168.1.16:8080', // IP máy tính bạn
  cleartext: true
}
```

**Lấy IP máy:**
```bash
ipconfig
# Tìm IPv4 Address (e.g., 192.168.1.16)
```

**Sync lại:**
```bash
npx cap sync android
```

**Giờ:** Khi sửa code → Ctrl+S → App tự reload! 🔥

### 5.2. Build Production APK

**Bước 1:** Build web
```bash
npm run build
```

**Bước 2:** Comment server URL trong `capacitor.config.ts`:
```typescript
server: {
  // url: 'http://192.168.1.16:8080', // Comment out
  androidScheme: 'https'
}
```

**Bước 3:** Sync
```bash
npx cap sync android
```

**Bước 4:** Build APK trong Android Studio
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Chờ build xong
- APK ở: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📋 BƯỚC 6: NATIVE FEATURES

### 6.1. Camera Plugin (cho Food Scanner)

```bash
npm install @capacitor/camera
npx cap sync
```

**Code:**
```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });
  
  const imageUrl = image.webPath;
  // Xử lý image...
};
```

### 6.2. Local Notifications

```bash
npm install @capacitor/local-notifications
npx cap sync
```

**Code:**
```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

const scheduleReminder = async () => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "💧 Nhắc nhở uống nước",
        body: "Đã đến giờ uống nước rồi!",
        id: 1,
        schedule: { at: new Date(Date.now() + 3600000) }, // 1 giờ sau
      }
    ]
  });
};
```

### 6.3. Status Bar & Splash Screen

```bash
npm install @capacitor/status-bar @capacitor/splash-screen
npx cap sync
```

---

## 🎨 TÙYCHỈNH APP ICON & SPLASH SCREEN

### Icon
1. Tạo icon 1024x1024px (PNG)
2. Đặt tại `android/app/src/main/res/`
3. Hoặc dùng tool: https://icon.kitchen

### Splash Screen
Tạo file `android/app/src/main/res/drawable/splash.png` (2732x2732px)

---

## ⚠️ FIX LỖI THƯỜNG GẶP

### Lỗi 1: "Failed to load module script"
**Fix:** Sửa `base: './'` trong `vite.config.ts`

### Lỗi 2: "CORS error"
**Fix:** Supabase đã config CORS, nhưng check lại Supabase Dashboard → Settings → API

### Lỗi 3: "App trắng screen"
**Fix:** 
```bash
# Clear cache
rm -rf android/app/build
npx cap sync android
```

### Lỗi 4: "Gradle build failed"
**Fix:** 
- Update Android Studio
- Tools → SDK Manager → Update SDK

---

## 📱 TEST TRÊN THIẾT BỊ THẬT

### 1. Enable USB Debugging (Android)
- Settings → About Phone
- Tap "Build Number" 7 lần
- Settings → Developer Options → USB Debugging (ON)

### 2. Connect & Run
```bash
# Check devices
adb devices

# Run on device
# Trong Android Studio, chọn device và click Run
```

---

## 🚀 PUBLISH LÊN GOOGLE PLAY

### 1. Generate Keystore
```bash
cd android/app

keytool -genkey -v -keystore thucdonai.keystore -alias thucdonai -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Config Gradle
File `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('thucdonai.keystore')
            storePassword 'your-password'
            keyAlias 'thucdonai'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release APK
```bash
cd android
./gradlew assembleRelease

# APK tại: app/build/outputs/apk/release/app-release.apk
```

### 4. Upload lên Google Play Console
- https://play.google.com/console
- Create app
- Upload APK/AAB
- Fill info & publish

---

## 📊 CHECKLIST DEPLOY ANDROID

- [ ] Install Capacitor
- [ ] Config `capacitor.config.ts`
- [ ] Config `vite.config.ts` với `base: './'`
- [ ] Build web: `npm run build`
- [ ] Sync: `npx cap sync android`
- [ ] Open Android Studio: `npx cap open android`
- [ ] Test trên emulator
- [ ] Test trên thiết bị thật
- [ ] Build production APK
- [ ] Test APK install
- [ ] Generate keystore (cho Play Store)
- [ ] Build release APK
- [ ] Upload lên Google Play

---

## 🎯 QUICK COMMANDS REFERENCE

```bash
# Development
npm run dev                          # Start web dev server
npx cap sync android                # Sync changes to Android
npx cap open android                # Open Android Studio

# Build
npm run build                       # Build web
npx cap copy android                # Copy dist to Android
npx cap sync android                # Sync + copy

# Plugin Management
npm install @capacitor/camera       # Install plugin
npx cap sync                        # Sync all platforms

# Debugging
npx cap run android                 # Run on connected device
adb logcat                          # View Android logs
```

---

## 💡 TIPS

### 1. Performance
- Minimize bundle size: `npm run build` → Check `dist/` size
- Lazy load routes
- Optimize images (WebP format)

### 2. Native Feel
- Use native status bar color
- Handle back button
- Add splash screen
- Use native fonts

### 3. Testing
- Test offline mode
- Test on different screen sizes
- Test permissions (camera, notifications)

---

## 🚀 ALTERNATIVE: PWA (EASIER)

Nếu không muốn Android Studio, dùng PWA:

### 1. Install PWA Plugin
```bash
npm install vite-plugin-pwa -D
```

### 2. Config
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ThucdonAI',
        short_name: 'ThucdonAI',
        theme_color: '#22c55e',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

### 3. Deploy
Deploy lên Vercel/Netlify → Users vào web → "Add to Home Screen"

**Pros:**
- ✅ Không cần Android Studio
- ✅ Không cần Google Play
- ✅ Dễ update

**Cons:**
- ❌ Không full native
- ❌ Limited native features

---

## 📚 TÀI LIỆU THAM KHẢO

- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio
- Vite PWA: https://vite-pwa-org.netlify.app/

---

**Bạn muốn tôi giúp setup Capacitor ngay không?** 🚀

Hoặc có câu hỏi gì về bất kỳ bước nào? 📱
