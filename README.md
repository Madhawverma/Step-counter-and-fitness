# Fitness Step Counter App

## Architecture Flow

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
