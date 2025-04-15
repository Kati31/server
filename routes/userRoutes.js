const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, address });
        await user.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error('Email không tồn tại!');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Mật khẩu không đúng!');
        res.json({ message: 'Đăng nhập thành công!', user: { _id: user._id, username: user.username, email: user.email, address: user.address } });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;