const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectWithRetry = require("./db");

const dishRoutes = require("./routes/dishRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Thêm route gốc (/)
app.get("/", (req, res) => {
    res.send("Ẩm Thực Truyền Thống API is running");
});

// Kết nối MongoDB
connectWithRetry();

app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));