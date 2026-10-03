const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Check header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Fallback for anonymous users using deviceId for now
        if (req.body.deviceId || req.params.deviceId) {
            return next();
        }
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded; // { id, deviceId, iat, exp }
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
