const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const Device = require('../models/Device');
const Alert = require('../models/Alert');
const authMiddleware = require('../middleware/auth');

// POST /sensordata - volá IoT zařízení
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const sensorData = new SensorData(data);
        await sensorData.save();

        // generování alertu
        const device = await Device.findById(data.deviceId);
        if (device) {
            const { thresholds } = device;
            if (data.temperature > thresholds.tempMax || data.temperature < thresholds.tempMin) {
                await new Alert({
                    deviceId: data.deviceId,
                    type: 'TEMP',
                    message: 'Temperature threshold exceeded'
                }).save();
            }
        }

        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /sensordata/:deviceId
router.get('/:deviceId', authMiddleware, async (req, res) => {
    const data = await SensorData.find({ deviceId: req.params.deviceId })
        .sort({ timestamp: -1 })
        .limit(100);
    res.json(data);
});

module.exports = router;
