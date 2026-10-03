const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Alex' },
  weight: { type: Number, default: 70 },
  height: { type: Number, default: 170 },
  strideLength: { type: Number, default: 0.76 },
  dailyGoal: { type: Number, default: 10000 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
