import * as SQLite from 'expo-sqlite';

// Open or create database
const db = SQLite.openDatabaseSync('fitstep.db');

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS DailySteps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE,
        steps INTEGER DEFAULT 0,
        distance REAL DEFAULT 0,
        calories REAL DEFAULT 0,
        activeMinutes INTEGER DEFAULT 0,
        goal INTEGER DEFAULT 10000,
        createdAt TEXT,
        updatedAt TEXT
      );
    `);
    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing DB:", error);
  }
};

export const getDailySteps = (date) => {
  try {
    const result = db.getFirstSync('SELECT * FROM DailySteps WHERE date = ?', [date]);
    return result;
  } catch (error) {
    console.error("Error getting daily steps:", error);
    return null;
  }
};

export const saveDailySteps = (data) => {
  try {
    const { date, steps, distance, calories, activeMinutes, goal } = data;
    const now = new Date().toISOString();
    
    const existing = getDailySteps(date);
    if (existing) {
      db.runSync(
        'UPDATE DailySteps SET steps = ?, distance = ?, calories = ?, activeMinutes = ?, updatedAt = ? WHERE date = ?',
        [steps, distance, calories, activeMinutes, now, date]
      );
    } else {
      db.runSync(
        'INSERT INTO DailySteps (date, steps, distance, calories, activeMinutes, goal, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [date, steps, distance, calories, activeMinutes, goal, now, now]
      );
    }
  } catch (error) {
    console.error("Error saving daily steps:", error);
  }
};
