const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    timestamp: { type: Date, default: Date.now },
    value: { type: mongoose.Schema.Types.Mixed, required: true } // může být číslo, string, boolean...
});

// Index na rychlé hledání podle zařízení a času (volitelné)
logSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
