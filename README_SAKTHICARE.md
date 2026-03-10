# 🍽️ SakthiCare - Meal Reminder App

## Overview
SakthiCare is a beautiful meal reminder app designed to help you never miss a meal or forget to drink water. With its stunning purple theme and delightful "Princess Mode," it makes healthy habits feel special.

## ✨ Features

### 🎯 Core Features
- **4 Daily Meal Reminders**: Breakfast (8 AM), Lunch (1 PM), Snacks (6 PM), Dinner (8 PM)
- **10-Minute Warnings**: Get notified 10 minutes before each meal
- **Water Reminders**: Each meal reminder includes a hydration reminder
- **Princess Mode**: 100 wholesome, flirty motivational lines
- **Sound Selection**: Choose from 5 different alarm sounds
- **Beautiful Animations**: Pulsing next meal indicator, smooth transitions
- **Skip Tracking**: Playful message when you ignore a meal

### 📱 Screens
1. **Launch Screen**: Animated spinning infinity icon with fade-in effects
2. **Home Screen**: Daily schedule with meal cards and Princess Mode toggle
3. **Alarm Screen**: Full-screen reminder with motivational messages
4. **Sound Selection**: Choose your preferred alarm sound

### 🎨 Design
- **Color Theme**: Purple (#9B59B6) with dark purple background
- **Meal Icons**: 
  - ☀️ Breakfast (Orange)
  - 🍽️ Lunch (Pink)
  - ☕ Snacks (Orange)
  - 🌙 Dinner (Purple)
- **Water Badge**: Blue droplet on each meal card
- **"NEXT" Badge**: Glowing indicator on upcoming meal

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn
- Expo CLI
- Android device for testing notifications

### Installation

1. **Install dependencies**:
   ```bash
   cd /app/frontend
   yarn install
   ```

2. **Start the development server**:
   ```bash
   yarn start
   ```

3. **Test on device**:
   - Scan QR code with Expo Go app
   - Note: Full notifications only work in production build

## 📦 Building for Production

### Build APK for Android

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure project**:
   ```bash
   eas build:configure
   ```

4. **Build production APK**:
   ```bash
   eas build --platform android --profile production
   ```

5. **Download and install**:
   - EAS will provide a download link
   - Transfer APK to Android device
   - Enable "Install from Unknown Sources"
   - Install and enjoy!

### Why Build APK?
**Real notifications only work in production builds** because:
- Expo Go has limited notification permissions
- Background alarms require native Android configuration
- Full-screen intents need proper app permissions
- Exact alarm scheduling requires production environment

## 🔔 Notification System

### Android Permissions
The app requests these permissions for optimal functionality:
- `POST_NOTIFICATIONS` - Show notifications
- `RECEIVE_BOOT_COMPLETED` - Restart alarms after reboot
- `WAKE_LOCK` - Wake device for alarms
- `VIBRATE` - Vibration patterns
- `USE_FULL_SCREEN_INTENT` - Full-screen alarm
- `SYSTEM_ALERT_WINDOW` - Alarm overlay
- `SCHEDULE_EXACT_ALARM` - Precise timing

### Notification Channels
- **Meal Warnings**: 10-minute advance notifications (High priority)
- **Meal Alarms**: Exact-time full-screen alarms (Max priority)

## 💜 Princess Mode

When enabled, Princess Mode adds a wholesome flirty motivational line to each alarm. Examples:

- "Every meal you take is a step closer to the best version of yourself... and trust me, that's breathtaking."
- "Taking care of yourself isn't just attractive—it's irresistible."
- "Hydration is liquid confidence, and you wear it well."

**100 unique lines** are included, ensuring fresh motivation every time!

## 🎵 Sound Options

Choose from 5 alarm sounds:
1. **Gentle Chime** - Soft bell tones
2. **Morning Birds** - Peaceful chirping
3. **Soft Piano** - Calming melody
4. **Wind Chimes** - Soothing tones
5. **Water Drops** - Gentle rhythm

## 🧪 Testing

### Test Alarm Screen
Use the "Test Alarm Screen" button on the home screen to:
- Preview the full alarm experience
- Test Princess Mode messages
- Experience the skip dialog
- Verify sound playback

### Real Device Testing
For accurate notification testing:
1. Build production APK
2. Install on Android device
3. Grant all permissions
4. Wait for scheduled notifications OR use test button

## 📂 Project Structure

```
frontend/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Navigation configuration
│   ├── index.tsx            # Launch screen
│   ├── home.tsx             # Main schedule screen
│   ├── alarm.tsx            # Full-screen alarm
│   └── sound-selection.tsx  # Sound picker
├── constants/               # App constants
│   ├── meals.ts            # Meal schedule data
│   ├── princessLines.ts    # 100 motivational lines
│   └── sounds.ts           # Sound options
├── utils/                   # Utility functions
│   ├── notifications.ts    # Notification scheduling
│   ├── storage.ts          # AsyncStorage helpers
│   └── time.ts             # Time/meal calculations
├── assets/
│   └── sounds/             # Alarm sound files
├── app.json                # Expo configuration
└── eas.json                # Build configuration
```

## 🎯 Key Technical Details

### Notification Scheduling
- Uses `expo-notifications` with exact time triggers
- Repeats daily automatically
- Survives app restart and device reboot
- Works in background

### State Management
- AsyncStorage for Princess Mode preference
- AsyncStorage for sound selection
- Real-time next meal calculation
- Permission status monitoring

### Animations
- Spinning infinity icon on launch (3s rotation)
- Pulsing next meal card (1.0→1.05 scale)
- Icon pulse on alarm screen (1.0→1.2 scale)
- Fade-in and scale animations throughout
- Smooth navigation transitions

## 🐛 Troubleshooting

### Notifications Not Working
- **In Expo Go**: Limited notification support - build APK
- **After Install**: Grant all permissions in Settings
- **Still Issues**: Check system notification settings

### Sound Not Playing
- Ensure device volume is up
- Check "Do Not Disturb" mode
- Verify app has audio permissions
- Test with different sound options

### App Not Opening on Alarm
- Grant "Display over other apps" permission
- Enable "Full-screen intent" in notification settings
- Disable battery optimization for app

## 📱 Device Compatibility

### Android
- **Minimum**: Android 7.0 (API 24)
- **Recommended**: Android 10+ for best notification experience
- **Tested on**: Android 11, 12, 13, 14

### iOS
- Basic functionality supported
- Full notification features require iOS 12+
- Note: Exact alarm scheduling differs from Android

## 🎨 Customization

### Changing Meal Times
Edit `/app/frontend/constants/meals.ts`:
```typescript
{
  id: 'breakfast',
  name: 'Breakfast',
  hour: 8,  // Change this
  minute: 0, // And this
  // ...
}
```

### Adding Princess Lines
Add to `/app/frontend/constants/princessLines.ts`:
```typescript
export const PRINCESS_LINES = [
  "Your new line here...",
  // existing lines...
];
```

### Changing Colors
Update styles in each screen file:
- Primary Purple: `#9B59B6`
- Background: `#1A0A2E`
- Cards: `#2D1B4E`
- Accent: `#BB8FCE`

## 📄 License

This project is for personal use.

## 🙏 Acknowledgments

Built with love for Sakthi to help maintain healthy eating habits! 💜

---

**Remember**: The real magic happens in the production build where notifications work seamlessly to keep you nourished and hydrated! 🍽️💧
