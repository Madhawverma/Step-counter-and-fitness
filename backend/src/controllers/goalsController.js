const Goal = require('../models/Goal');

// Set or update goal
exports.setGoal = async (req, res) => {
    try {
        const { deviceId, dailyStepsGoal, dailyCaloriesGoal, dailyDistanceGoal } = req.body;
        
        if (!deviceId) {
            return res.status(400).json({ success: false, message: 'deviceId is required' });
        }

        const updatedGoal = await Goal.findOneAndUpdate(
            { deviceId },
            { dailyStepsGoal, dailyCaloriesGoal, dailyDistanceGoal },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: updatedGoal });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get current goal
exports.getGoal = async (req, res) => {
    try {
        const { deviceId } = req.params;
        let goal = await Goal.findOne({ deviceId });
        
        if (!goal) {
            // Return default goals if not set
            goal = { deviceId, dailyStepsGoal: 10000, dailyCaloriesGoal: 500, dailyDistanceGoal: 5 };
        }
        
        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
