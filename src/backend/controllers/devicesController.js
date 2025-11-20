exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ ownerId: req.user.id });
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createDevice = async (req, res) => {
    try {
        const { name, type, location } = req.body;
        const device = new Device({
            name,
            type,
            location,
            ownerId: req.user.id
        });

        await device.save();
        res.json(device);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDevice = async (req, res) => {
    try {
        const updated = await Device.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.user.id },
            { ...req.body },
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: 'Device not found' });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const result = await Device.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.user.id
        });

        if (!result)
            return res.status(404).json({ message: 'Device not found' });

        res.json({ message: 'Device deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
