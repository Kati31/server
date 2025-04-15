const express = require('express');
const router = express.Router();
const { Dish } = require('../models');

router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;