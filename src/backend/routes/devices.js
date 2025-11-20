const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware); // všechny endpointy vyžadují přihlášení

// GET /devices
router.get('/', async (req, res) => {
    const devices = await Device.find({ ownerId: req.user.id });
    res.json(devices);
});

// POST /devices
router.post('/', async (req, res) => {
    const { name, location, thresholds } = req.body;
    const device = new Device({ ownerId: req.user.id, name, location, thresholds });
    await device.save();
    res.json({ status: 'created', _id: device._id });
});

// PUT /devices/:id
router.put('/:id', async (req, res) => {
    const { name, location, thresholds } = req.body;
    await Device.updateOne({ _id: req.params.id, ownerId: req.user.id }, { name, location, thresholds });
    res.json({ status: 'updated' });
});

// DELETE /devices/:id
router.delete('/:id', async (req, res) => {
    await Device.deleteOne({ _id: req.params.id, ownerId: req.user.id });
    res.json({ status: 'deleted' });
});

module.exports = router;
