const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  deviceId: { type: String, required: true },
  date: { type: String, required: true },
  steps: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure one record per device per day
activitySchema.index({ deviceId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Activity', activitySchema);
