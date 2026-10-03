const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  deviceId: { type: String, required: true, unique: true }, // Keep for guest users
  email: { type: String, unique: true, sparse: true }, // Sparse allows nulls to be unique
  password: { type: String },
  name: { type: String, default: 'Alex' },
  weight: { type: Number, default: 70 },
  height: { type: Number, default: 170 },
  strideLength: { type: Number, default: 0.76 },
  dailyGoal: { type: Number, default: 10000 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
