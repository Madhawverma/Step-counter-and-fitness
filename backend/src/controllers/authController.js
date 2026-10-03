const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
    try {
        const { deviceId, email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if deviceId already has an anonymous profile
        user = await User.findOne({ deviceId });
        
        if (user) {
            // Upgrade anonymous user to registered user
            user.email = email;
            user.password = hashedPassword;
            if (name) user.name = name;
            await user.save();
        } else {
            // Create new user
            user = new User({
                deviceId: deviceId || 'web_' + Date.now(),
                email,
                password: hashedPassword,
                name
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id, deviceId: user.deviceId }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

        res.status(201).json({ success: true, token, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, deviceId: user.deviceId }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

        res.status(200).json({ success: true, token, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
