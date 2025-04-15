const express = require('express');
const router = express.Router();
const { Contact } = require('../models');

router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Gửi lời nhắn thành công!' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;