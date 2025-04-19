const express = require("express");
const router = express.Router();
const { Order } = require("../models");

router.post("/", async (req, res) => {
    try {
        const { userId, items, total } = req.body;
        const newOrder = new Order({ userId, items, total });
        await newOrder.save();
        console.log("Order saved:", newOrder); // Thêm log để kiểm tra
        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error saving order:", error); // Thêm log lỗi
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;