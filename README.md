# FitStep - Step Towards a Healthier You 🏃‍♂️💚

FitStep is a premium, offline-first step counter and fitness tracking application built with React Native and Expo. It features a modern, dark-themed UI with neon green accents, smooth animations, and robust local data storage.

## ✨ Features

- **Real-time Step Tracking:** Leverages device pedometer sensors for accurate step counting.
- **Premium UI/UX:** A stunning dark theme with vibrant neon green accents and glassmorphism elements.
- **Interactive Animations:** Features a custom 4-state animated splash screen and smooth screen transitions.
- **Offline First:** 100% of your data stays on your device using AsyncStorage (SQLite/Local). No internet required.
- **Goal Management:** Set and track daily step, distance, and calorie goals.
- **Historical Data:** View your past fitness data with beautifully rendered interactive charts.
- **Privacy Focused:** No cloud sync, no tracking, complete data ownership.

## 📸 Screenshots

*(Add screenshots of your Splash Screen, Home Screen, and Profile here)*

## 🚀 Tech Stack

- **Framework:** React Native & Expo
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **State Management:** React Context API
- **Storage:** React Native Async Storage
- **Charts:** react-native-chart-kit
- **Animations:** React Native Animated API & Lottie (optional)
- **Icons:** Expo Vector Icons (Ionicons, MaterialCommunityIcons)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/FitStep.git
   cd FitStep/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npx expo start
   ```

4. **Run on Device/Emulator:**
   - Press `a` to run on an Android emulator.
   - Press `i` to run on an iOS simulator.
   - Or scan the QR code using the Expo Go app on your physical device.

## 📦 Building the APK

To generate a standalone Android APK, ensure you have an Expo dev account and run:
```bash
eas build -p android --profile preview
```

## 👨‍💻 Developer

**Developed by Madhaw Verma**

## 📄 License

This project is licensed under the MIT License.
