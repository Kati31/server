const express = require('express');
const router = express.Router();
const { News } = require('../models');

router.get('/', async (req, res) => {
    try {
        const news = await News.find();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const newsItem = await News.findById(req.params.id);
        if (!newsItem) throw new Error('Tin tức không tồn tại!');
        res.json(newsItem);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;