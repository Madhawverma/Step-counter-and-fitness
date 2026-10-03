# 🏃‍♂️ Step Counter & Fitness App

A comprehensive React Native application designed to track your daily physical activity. This app seamlessly monitors your steps using phone sensors, calculates calories burned and distance covered, and provides historical data tracking to help you reach your fitness goals.

## 🌟 Features

- **Real-Time Step Tracking:** Uses on-device sensors to accurately count steps in the background.
- **Fitness Metrics:** Automatically calculates distance traveled and calories burned based on step count and user profile.
- **Daily Goals:** Set, track, and achieve your daily step and activity goals.
- **Activity History:** View past activity and daily stats saved securely on your device.
- **Beautiful UI:** A smooth, responsive, and intuitive interface built with React Native.

## 🏗 Architecture Flow

The data flows from hardware sensors up to the user interface in a structured manner:

```text
Phone Sensors
     ↓
Step Counter Service
     ↓
Real Steps
     ↓
Fitness Calculation
 ┌───┼───────────────┐
 ↓   ↓               ↓
Steps Distance    Calories
 └───┼───────────────┘
     ↓
Local Storage / SQLite
     ↓
History + Daily Stats
     ↓
React Native UI
```

## 📂 Project Structure

```text
src/
├── components/    # Reusable UI components (Cards, Progress bars, etc.)
├── screens/       # Application screens (Home, Activity, History, etc.)
├── navigation/    # React Navigation configuration
├── services/      # Background services and API integrations
├── storage/       # Local database/SQLite logic
├── hooks/         # Custom React Hooks
├── utils/         # Helper functions (calculators, date formatting)
├── constants/     # App-wide constants (colors, dimensions)
└── context/       # React Context for state management
```

## 🚀 Getting Started

_This project is currently in the initial setup phase. Installation and running instructions will be added once the initial logic is implemented._
