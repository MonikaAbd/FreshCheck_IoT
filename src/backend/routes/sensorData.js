const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// POST /sensordata
router.post('/', async (req, res) => {
    try {
        const entry = new SensorData(req.body);
        await entry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /sensordata/:deviceId
router.get('/:deviceId', async (req, res) => {
    try {
        const data = await SensorData.find({ deviceId: req.params.deviceId })
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
