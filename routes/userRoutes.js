const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key cho JWT
const JWT_SECRET = "your_jwt_secret_key"; // Thay bằng secret key thực tế

// Middleware kiểm tra quyền truy cập
const authorize = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Bạn không có quyền truy cập" });
            }

            req.user = decoded; // Lưu thông tin user vào request
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(401).json({ message: "Token không hợp lệ" });
        }
    };
};

// Đăng ký người dùng
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

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" } // Token hết hạn sau 1 giờ
        );

        res.json({ message: "Đăng nhập thành công", token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: error.message });
    }
});

// Route chỉ dành cho admin
router.get("/admin", authorize(["admin"]), (req, res) => {
    res.json({ message: "Chào mừng admin", user: req.user });
});

// Route dành cho user hoặc admin
router.get("/profile", authorize(["user", "admin"]), (req, res) => {
    res.json({ message: "Thông tin người dùng", user: req.user });
});

module.exports = router;