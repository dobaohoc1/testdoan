# 📱 TÓM TẮT: CHẠY APP TRÊN ANDROID

## 🎯 2 CÁCH CHÍNH

### ✅ **CÁCH 1: CAPACITOR (RECOMMEND)**
- Wrap React app thành native Android app
- Có thể build APK để install
- Access native features (camera, notifications)
- Deploy lên Google Play Store

### ⚡ **CÁCH 2: PWA (DÃN NHẤT)**
- Progressive Web App
- Users vào web → "Add to Home Screen"
- Không cần Android Studio
- Giới hạn native features

---

## 🚀 QUICK START (CAPACITOR)

### Bước 1: Chạy setup script
```powershell
cd c:\Users\Administrator\Downloads\DoAn\an-ai-menu-mate-main
.\setup-android.ps1
```

**Script sẽ tự động:**
- Install Capacitor
- Add Android platform
- Install plugins (camera, notifications)
- Build web app
- Sync vào Android

### Bước 2: Mở Android Studio
```powershell
npx cap open android
```

### Bước 3: Chạy app
- Click **▶️ Run** button
- Chọn emulator hoặc thiết bị thật

---

## 📋 MANUAL STEPS

Nếu không dùng script, làm thủ công:

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli

# 2. Initialize (nhập: ThucdonAI, com.thucdonai.app, dist)
npx cap init

# 3. Add Android
npm install @capacitor/android
npx cap add android

# 4. Build web
npm run build

# 5. Sync
npx cap sync android

# 6. Open Android Studio
npx cap open android
```

---

## 🔧 LIVE RELOAD DEVELOPMENT

**Bước 1:** Lấy IP máy
```powershell
ipconfig
# Tìm IPv4 Address, ví dụ: 192.168.1.16
```

**Bước 2:** Edit `capacitor.config.ts`
```typescript
server: {
  url: 'http://192.168.1.16:8080', // IP của bạn
  cleartext: true
}
```

**Bước 3:** Sync
```bash
npx cap sync android
```

**Bước 4:** Chạy dev server
```bash
npm run dev
```

**Giờ:** Sửa code → Ctrl+S → App tự reload! 🔥

---

## 📦 BUILD APK

### Debug APK (test):
```bash
# 1. Build web
npm run build

# 2. Comment server URL trong capacitor.config.ts
# server: { // url: '...' }

# 3. Sync
npx cap sync android

# 4. Trong Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (production):
```bash
# 1. Generate keystore
cd android/app
keytool -genkey -v -keystore thucdonai.keystore -alias thucdonai -keyalg RSA -keysize 2048 -validity 10000

# 2. Config signing trong android/app/build.gradle

# 3. Build
cd android
./gradlew assembleRelease

# APK: app/build/outputs/apk/release/app-release.apk
```

---

## 🔌 NATIVE PLUGINS

### Camera
```bash
npm install @capacitor/camera
npx cap sync
```

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.Uri
  });
  return image.webPath;
};
```

### Local Notifications
```bash
npm install @capacitor/local-notifications
npx cap sync
```

```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

await LocalNotifications.schedule({
  notifications: [{
    title: "💧 Nhắc uống nước",
    body: "Đã đến giờ rồi!",
    id: 1
  }]
});
```

---

## ⚠️ REQUIREMENTS

### Phần mềm cần:
- ✅ Node.js (đã có)
- ✅ Android Studio
- ✅ Java JDK 11+

### Download Android Studio:
https://developer.android.com/studio

### Sau khi install:
- Tools → SDK Manager → Install Android SDK
- Tools → Device Manager → Create Virtual Device (Emulator)

---

## 🎨 CUSTOMIZE

### App Icon
- Tạo icon 1024x1024px
- Tool: https://icon.kitchen
- Đặt vào `android/app/src/main/res/`

### Splash Screen
- Tạo `splash.png` (2732x2732px)
- Đặt vào `android/app/src/main/res/drawable/`

### Colors
Edit `android/app/src/main/res/values/colors.xml`

---

## 📊 TESTING

### Emulator:
1. Android Studio → Device Manager
2. Create Virtual Device (Pixel 5, Android 11+)
3. Click ▶️ Run

### Thiết bị thật:
1. Settings → About Phone → Tap "Build Number" 7 lần
2. Developer Options → USB Debugging (ON)
3. Cắm USB
4. Android Studio detect → Click ▶️ Run

---

## 🐛 TROUBLESHOOTING

### App màn hình trắng?
```bash
# Clear cache
rm -rf android/app/build
npx cap sync android
```

### Gradle build failed?
- Update Android Studio
- Tools → SDK Manager → Update SDK

### CORS error?
- Check Supabase settings
- Add domain vào allowed origins

### Live reload không work?
- Check IP đúng chưa
- Phone/Emulator cùng WiFi với máy tính

---

## 📚 FILES ĐÃ TẠO

- ✅ `ANDROID_SETUP_GUIDE.md` - Hướng dẫn chi tiết đầy đủ
- ✅ `setup-android.ps1` - Script setup tự động
- ✅ `capacitor.config.template.ts` - Template config file

---

## 🎯 CHECKLIST

Setup:
- [ ] Install Capacitor packages
- [ ] Run `npx cap init`
- [ ] Add Android platform
- [ ] Build web app
- [ ] Sync to Android
- [ ] Open Android Studio

Development:
- [ ] Setup live reload
- [ ] Test trên emulator
- [ ] Test trên thiết bị thật

Production:
- [ ] Build production web
- [ ] Generate keystore
- [ ] Build release APK
- [ ] Test install APK

---

## 💡 TIPS

1. **Development:** Dùng live reload để dev nhanh
2. **Testing:** Test cả emulator VÀ thiết bị thật
3. **Performance:** Check bundle size nhỏ (<5MB)
4. **Native:** Dùng plugins khi cần (camera, notifications)

---

## 📞 SUPPORT

- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio
- Full guide: `ANDROID_SETUP_GUIDE.md`

---

**Sẵn sàng build Android app! 🚀📱**
