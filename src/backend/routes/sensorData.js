const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// POST /sensordata
router.post('/', async (req, res) => {
    try {
        // pokud middleware našel device, použijeme jeho _id
        const deviceId = req.device ? req.device._id : req.body.deviceId;
        if (!deviceId) {
            return res.status(400).json({ message: 'Device ID is required' });
        }

        const entry = new SensorData({
            ...req.body,
            deviceId
        });

        await entry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /sensordata/:deviceId
router.get('/:deviceId', async (req, res) => {
    try {
        // umožníme přístup jen vlastníkovi zařízení
        const deviceId = req.device ? req.device._id : req.params.deviceId;
        if (!deviceId) {
            return res.status(400).json({ message: 'Device ID is required' });
        }

        const data = await SensorData.find({ deviceId })
            .sort({ timestamp: -1 })
            .limit(100);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
