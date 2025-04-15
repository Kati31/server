const express = require('express');
const router = express.Router();
const { Order, Dish } = require('../models');

router.post('/', async (req, res) => {
    try {
        const { userId, dishes, address, paymentMethod } = req.body;
        let total = 0;
        for (const item of dishes) {
            const dish = await Dish.findById(item.dishId);
            if (!dish) throw new Error('Món ăn không tồn tại');
            total += dish.price * item.quantity;
        }
        const order = new Order({
            userId: userId || null,
            dishes,
            total,
            address,
            paymentMethod,
        });
        await order.save();
        res.status(201).json({ message: 'Đặt hàng thành công!', orderId: order._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;