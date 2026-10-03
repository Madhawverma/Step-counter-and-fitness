const Activity = require('../models/Activity');

exports.syncActivity = async (req, res) => {
  const { deviceId, date, steps, distance, calories, activeMinutes } = req.body;
  if (!deviceId || !date) return res.status(400).json({ error: 'deviceId and date required' });

  try {
    let activity = await Activity.findOne({ deviceId, date });
    if (activity) {
      activity.steps = steps;
      activity.distance = distance;
      activity.calories = calories;
      activity.activeMinutes = activeMinutes;
      await activity.save();
    } else {
      activity = await Activity.create({ deviceId, date, steps, distance, calories, activeMinutes });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ deviceId: req.params.deviceId }).sort({ date: -1 }).limit(30);
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
