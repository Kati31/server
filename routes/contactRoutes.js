const express = require("express");
const router = express.Router();
const { Contact } = require("../models");

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log("Contact saved:", newContact); // Thêm log để kiểm tra
        res.status(201).json(newContact);
    } catch (error) {
        console.error("Error saving contact:", error); // Thêm log lỗi
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;