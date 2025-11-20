const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const authMiddleware = require('../middleware/auth');
const Device = require('../models/Device');

router.use(authMiddleware);

// GET /alerts/:deviceId?active=true
router.get('/:deviceId', async (req, res) => {
    const active = req.query.active === 'true';
    const filter = { deviceId: req.params.deviceId };
    if (active) filter.active = true;

    const alerts = await Alert.find(filter).sort({ timestamp: -1 });
    res.json(alerts);
});

// PUT /alerts/:id/resolve
router.put('/:id/resolve', async (req, res) => {
    await Alert.updateOne({ _id: req.params.id }, { active: false, resolvedAt: new Date() });
    res.json({ status: 'resolved' });
});

module.exports = router;
