# 📱 SakthiCare - Expo Go Setup Guide

## 🚀 Current Expo Version
**Expo SDK**: 54.0.33  
**Expo CLI**: 54.0.23

## 📲 How to Run SakthiCare on Your Phone

### Method 1: Expo Go App (Recommended)
1. **Install Expo Go** from App Store/Play Store
2. **Start development server**:
   ```bash
   cd "d:\10 march sakthi\sakthicare-main"
   npx expo start
   ```
3. **Scan QR code** that appears in terminal
4. **Open in Expo Go** app

### Method 2: Web Version
1. **Start web server**:
   ```bash
   npx expo start --web
   ```
2. **Open browser** to http://localhost:8081
3. **Test app functionality**

### Method 3: Development Build
1. **Build development APK**:
   ```bash
   eas build --platform android --profile development
   ```
2. **Install APK** on Android device
3. **Full native functionality**

## 📋 App Features Available in Expo Go

### ✅ Working Features:
- 🍽️ **Meal Reminder Cards** (Breakfast, Lunch, Snacks, Dinner)
- 👑 **Princess Mode** (100+ motivational messages)
- 🔔 **Notification Permission** setup
- 🎵 **Sound Selection** interface
- 💜 **Beautiful Purple Theme**
- ✨ **Smooth Animations**

### ⚠️ Limited in Expo Go:
- 🚫 **Exact alarm scheduling** (requires production build)
- 🚫 **Boot persistence** 
- 🚫 **Full-screen alarms**
- 🚫 **Background notifications**

## 🎯 Recommended Testing Flow

### Step 1: Expo Go (Quick Test)
```bash
npx expo start
```
- Test UI/UX
- Verify Princess Mode
- Check navigation

### Step 2: Production APK (Full Features)
- Build via GitHub Actions
- Install on device
- Test complete notification system

## 📱 Expo Go Compatibility

**Required Expo Go Version**: Latest (supports SDK 54)
**Download Links**:
- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🔧 Troubleshooting

### If QR Code Doesn't Work:
1. **Check network** - same WiFi connection
2. **Update Expo Go** to latest version
3. **Clear cache** in Expo Go app
4. **Restart development server**

### If App Won't Load:
1. **Check Metro bundler** output for errors
2. **Verify dependencies** with `npx expo install --fix`
3. **Reset project** with `npm run reset-project`

## 🎉 Ready to Test!

**Start the development server** and scan the QR code to test SakthiCare on your device:

```bash
cd "d:\10 march sakthi\sakthicare-main"
npx expo start
```

The app will load with the beautiful purple theme and all meal reminder functionality ready for testing!
