const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },
    dailyStepsGoal: { type: Number, default: 10000 },
    dailyCaloriesGoal: { type: Number, default: 500 },
    dailyDistanceGoal: { type: Number, default: 5 }, // in km
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
