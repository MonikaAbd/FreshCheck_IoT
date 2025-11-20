const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String },
    thresholds: {
        tempMin: Number,
        tempMax: Number,
        humidityMin: Number,
        humidityMax: Number,
        maxDoorOpenSeconds: Number
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
