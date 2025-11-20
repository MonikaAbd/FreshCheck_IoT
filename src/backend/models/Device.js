const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// _id je implicitně generováno
module.exports = mongoose.model('Device', deviceSchema);
