const Alert = require('../models/Alert');

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ userId: req.user.id }).sort({ timestamp: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAlert = async (req, res) => {
    try {
        const alert = new Alert({
            userId: req.user.id,
            deviceId: req.body.deviceId,
            conditionType: req.body.conditionType,
            threshold: req.body.threshold
        });

        await alert.save();
        res.json(alert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAlert = async (req, res) => {
    try {
        const alert = await Alert.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!alert) return res.status(404).json({ message: 'Alert not found' });

        res.json({ message: 'Alert deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
