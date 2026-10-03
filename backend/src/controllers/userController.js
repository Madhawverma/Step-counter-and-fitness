const User = require('../models/User');

exports.syncProfile = async (req, res) => {
  const { deviceId, name, weight, height, strideLength, dailyGoal } = req.body;
  if (!deviceId) return res.status(400).json({ error: 'deviceId is required' });

  try {
    let user = await User.findOne({ deviceId });
    if (user) {
      user.name = name || user.name;
      user.weight = weight || user.weight;
      user.height = height || user.height;
      user.strideLength = strideLength || user.strideLength;
      user.dailyGoal = dailyGoal || user.dailyGoal;
      await user.save();
    } else {
      user = await User.create({ deviceId, name, weight, height, strideLength, dailyGoal });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ deviceId: req.params.deviceId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
