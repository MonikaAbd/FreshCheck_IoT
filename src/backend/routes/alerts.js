const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /alerts/:deviceId?active=true
router.get('/:deviceId', async (req, res) => {
    try {
        const active = req.query.active === 'true';
        const filter = { deviceId: req.params.deviceId, userId: req.user.id };
        if (active) filter.active = true;

        const alerts = await Alert.find(filter).sort({ timestamp: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /alerts/:id/resolve
router.put('/:id/resolve', async (req, res) => {
    try {
        const alert = await Alert.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { active: false, resolvedAt: new Date() },
            { new: true }
        );

        if (!alert) return res.status(404).json({ message: 'Alert not found' });

        res.json(alert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
