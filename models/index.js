const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Định nghĩa các schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Thêm trường role
});

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    history: { type: String },
    image: { type: String },
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dishes: [{
        dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
        quantity: { type: Number, required: true },
    }],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

// Đăng ký các model
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Dish = mongoose.models.Dish || mongoose.model('Dish', dishSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
const News = mongoose.models.News || mongoose.model('News', newsSchema);

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirmPassword, role, secretKey } = req.body;

        // Kiểm tra nếu username hoặc email đã tồn tại
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username hoặc email đã tồn tại" });
        }

        // Kiểm tra mật khẩu và nhập lại mật khẩu
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu và nhập lại mật khẩu không khớp" });
        }

        // Kiểm tra mã bí mật để tạo tài khoản admin
        if (role === "admin" && secretKey !== "your_admin_secret_key") {
            return res.status(403).json({ message: "Bạn không có quyền tạo tài khoản admin" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "user", // Mặc định là "user" nếu không truyền role
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công", user: { username: newUser.username, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    User,
    Dish,
    Order,
    Contact,
    News,
    router
};