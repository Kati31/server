const express = require("express");
const router = express.Router();
const { Dish } = require("../models");
const jwt = require("jsonwebtoken");

// Middleware kiểm tra quyền admin
const authorizeAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });
        }

        const decoded = jwt.verify(token, "your_jwt_secret_key");
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }

        next();
    } catch (error) {
        console.error("Authorization error:", error);
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};

// API lấy danh sách món ăn
router.get("/", async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API thêm món ăn (chỉ admin)
router.post("/", authorizeAdmin, async (req, res) => {
    const { name, price, description, category, image } = req.body;

    try {
        const newDish = new Dish({
            name,
            price,
            description,
            category,
            image,
        });

        const savedDish = await newDish.save();
        res.status(201).json(savedDish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API chỉnh sửa thông tin món ăn (chỉ admin)
router.put("/:id", authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;

    try {
        const dish = await Dish.findById(id);
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }

        // Cập nhật thông tin món ăn
        if (name !== undefined) dish.name = name;
        if (price !== undefined) dish.price = price;
        if (description !== undefined) dish.description = description;

        const updatedDish = await dish.save();
        res.json(updatedDish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API xóa món ăn (chỉ admin)
router.delete("/:id", authorizeAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const dish = await Dish.findByIdAndDelete(id);
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }

        res.json({ message: "Dish deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;