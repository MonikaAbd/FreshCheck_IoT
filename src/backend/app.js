require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const sensorDataRoutes = require('./routes/sensordata');
const alertRoutes = require('./routes/alerts');

// JWT middleware
const jwt = require('jsonwebtoken');

// Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/iot_project';

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


// ---------------------------
// AUTH MIDDLEWARE
// ---------------------------
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;

    if (!header)
        return res.status(401).json({ message: 'Missing authorization header' });

    const token = header.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        req.user = { id: decoded.id };
        next();
    });
}


// ---------------------------
// ROUTES
// ---------------------------

// Public (no auth)
app.use('/auth', authRoutes);

// Protected (requires JWT)
app.use('/devices', authMiddleware, deviceRoutes);
app.use('/sensordata', authMiddleware, sensorDataRoutes);
app.use('/alerts', authMiddleware, alertRoutes);


// ---------------------------
// ERROR HANDLER
// ---------------------------
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});


// ---------------------------
// START SERVER
// ---------------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
