const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    active: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
});

alertSchema.index({ deviceId: 1, active: 1 });

module.exports = mongoose.model('Alert', alertSchema);
