const DailySteps = require('../models/DailySteps');

// Sync daily steps
exports.syncSteps = async (req, res) => {
    try {
        const { deviceId, date, steps, distance, calories, activeMinutes } = req.body;
        
        if (!deviceId || !date) {
            return res.status(400).json({ success: false, message: 'deviceId and date are required' });
        }

        const updatedSteps = await DailySteps.findOneAndUpdate(
            { deviceId, date },
            { steps, distance, calories, activeMinutes },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: updatedSteps });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get step history for a device
exports.getHistory = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const history = await DailySteps.find({ deviceId }).sort({ date: -1 }).limit(30); // Last 30 days
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
