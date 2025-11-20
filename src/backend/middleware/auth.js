const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }

    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid authorization format' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = { id: decoded.id };
        next();
    });
};
