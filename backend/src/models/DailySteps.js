const mongoose = require('mongoose');

const dailyStepsSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    date: { type: String, required: true }, // Format YYYY-MM-DD
    steps: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    activeMinutes: { type: Number, default: 0 },
}, { timestamps: true });

// Ensure one entry per device per day
dailyStepsSchema.index({ deviceId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailySteps', dailyStepsSchema);
