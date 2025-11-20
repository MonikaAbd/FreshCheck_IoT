const SensorData = require('../models/SensorData');

exports.getAllData = async (req, res) => {
    try {
        const data = await SensorData.find({ deviceId: req.params.deviceId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addData = async (req, res) => {
    try {
        const entry = new SensorData({
            deviceId: req.params.deviceId,
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            motion: req.body.motion
        });

        await entry.save();
        res.json(entry);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
