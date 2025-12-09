const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Device = require('../models/Device');

module.exports = async function (req, res, next) {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ message: 'Missing authorization header' });

    const [scheme, token] = header.split(' ');

    if (!scheme || !token) return res.status(401).json({ message: 'Invalid authorization format' });

    // 1️⃣ JWT login (uživatel)
    if (scheme === 'Bearer') {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = { id: decoded.id };
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired JWT token' });
        }
    }

    // 2️⃣ Permanent device token
    if (scheme === 'Device') {
        try {
            const device = await Device.findOne({ permanentToken: token });
            if (!device) return res.status(401).json({ message: 'Invalid permanent device token' });

            req.device = device;  // uložíme device, ne user
            return next();
        } catch (err) {
            return res.status(500).json({ message: 'Server error verifying permanent device token' });
        }
    }

    return res.status(401).json({ message: 'Unknown authorization type' });
};
