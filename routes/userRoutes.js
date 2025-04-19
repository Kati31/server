const express = require("express");
const router = express.Router();
const { User } = require("../models");

// Đăng ký người dùng
router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, password, email });
        await newUser.save();
        console.log("User saved:", newUser); // Thêm log để kiểm tra
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error saving user:", error); // Thêm log lỗi
        res.status(500).json({ message: error.message });
    }
});

// Đăng nhập (chỉ để kiểm tra, không ghi dữ liệu)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;