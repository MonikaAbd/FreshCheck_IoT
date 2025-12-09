const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// POST /auth/register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        const passwordHash = await bcrypt.hash(password, 10);
        const permanentToken = crypto.randomBytes(32).toString('hex');

        const user = new User({ email, passwordHash, name, permanentToken });
        await user.save();

        res.json({ status: 'ok', userId: user._id, permanentToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            permanentToken: user.permanentToken,
            user: { _id: user._id, email: user.email, name: user.name }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /auth/permanent/regenerate  (nový permanentní token)
router.post('/permanent/regenerate', async (req, res) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Missing authorization header' });

    const jwtToken = header.split(' ')[1];
    let decoded;

    try {
        decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || 'secret123');
    } catch (err) {
        return res.status(401).json({ message: 'Invalid JWT token – cannot regenerate permanent token' });
    }

    try {
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newPermanent = crypto.randomBytes(32).toString('hex');
        user.permanentToken = newPermanent;
        await user.save();

        res.json({ status: 'ok', permanentToken: newPermanent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /auth/permanent (smazání permanentního tokenu)
router.delete('/permanent', async (req, res) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Missing authorization header' });

    const jwtToken = header.split(' ')[1];
    let decoded;

    try {
        decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || 'secret123');
    } catch (err) {
        return res.status(401).json({ message: 'Invalid JWT token' });
    }

    try {
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.permanentToken = null;
        await user.save();

        res.json({ status: 'ok', message: 'Permanent token removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
