import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('fitstep.db');

db.execSync(`
  CREATE TABLE IF NOT EXISTS daily_steps (
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
  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    height REAL,
    weight REAL,
    gender TEXT,
    strideLength REAL,
    createdAt TEXT,
    updatedAt TEXT
  );
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dailyStepsGoal INTEGER DEFAULT 10000,
    weeklyStepsGoal INTEGER DEFAULT 70000,
    weightGoal REAL,
    updatedAt TEXT
  );
`);

// Daily Steps
export const getDailySteps = (date) => db.getFirstSync('SELECT * FROM daily_steps WHERE date = ?', [date]);
export const saveDailySteps = (data) => {
  const { date, steps, distance, calories, activeMinutes, goal } = data;
  const now = new Date().toISOString();
  const existing = getDailySteps(date);
  if (existing) {
    db.runSync('UPDATE daily_steps SET steps=?, distance=?, calories=?, activeMinutes=?, updatedAt=? WHERE date=?', [steps, distance, calories, activeMinutes, now, date]);
  } else {
    db.runSync('INSERT INTO daily_steps (date, steps, distance, calories, activeMinutes, goal, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)', [date, steps, distance, calories, activeMinutes, goal, now, now]);
  }
};
export const getHistory = () => db.getAllSync('SELECT * FROM daily_steps ORDER BY date DESC LIMIT 30');

// Profile
export const getProfile = () => db.getFirstSync('SELECT * FROM user_profile LIMIT 1');
export const saveProfile = (p) => {
  const now = new Date().toISOString();
  const existing = getProfile();
  if (existing) {
    db.runSync('UPDATE user_profile SET name=?, age=?, height=?, weight=?, gender=?, strideLength=?, updatedAt=? WHERE id=?', [p.name, p.age, p.height, p.weight, p.gender, p.strideLength, now, existing.id]);
  } else {
    db.runSync('INSERT INTO user_profile (name, age, height, weight, gender, strideLength, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)', [p.name, p.age, p.height, p.weight, p.gender, p.strideLength, now, now]);
  }
};

// Goals
export const getGoals = () => db.getFirstSync('SELECT * FROM goals LIMIT 1');
export const saveGoals = (g) => {
  const now = new Date().toISOString();
  const existing = getGoals();
  if (existing) {
    db.runSync('UPDATE goals SET dailyStepsGoal=?, weeklyStepsGoal=?, weightGoal=?, updatedAt=? WHERE id=?', [g.dailyStepsGoal, g.weeklyStepsGoal, g.weightGoal, now, existing.id]);
  } else {
    db.runSync('INSERT INTO goals (dailyStepsGoal, weeklyStepsGoal, weightGoal, updatedAt) VALUES (?,?,?,?)', [g.dailyStepsGoal, g.weeklyStepsGoal, g.weightGoal, now]);
  }
};

export const clearAllData = () => {
  db.execSync('DELETE FROM daily_steps; DELETE FROM user_profile; DELETE FROM goals;');
};
