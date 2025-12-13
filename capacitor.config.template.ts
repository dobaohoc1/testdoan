import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.thucdonai.app',
    appName: 'ThucdonAI',
    webDir: 'dist',
    server: {
        androidScheme: 'https',

        // 🔧 DEVELOPMENT MODE - Uncomment để enable live reload
        // Lấy IP bằng lệnh: ipconfig (Windows) hoặc ifconfig (Mac/Linux)
        // url: 'http://192.168.1.16:8080', // Thay bằng IP máy bạn
        // cleartext: true

        // 🚀 PRODUCTION MODE - Comment url ở trên khi build APK
    },

    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: "#22c55e", // Primary color của app
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP",
            showSpinner: false,
            androidSpinnerStyle: "large",
            iosSpinnerStyle: "small",
            spinnerColor: "#ffffff",
        },

        LocalNotifications: {
            smallIcon: "ic_stat_icon_config_sample",
            iconColor: "#22c55e",
            sound: "beep.wav",
        },

        StatusBar: {
            style: "LIGHT", // LIGHT | DARK
            backgroundColor: "#22c55e",
        },
    },
};

export default config;
