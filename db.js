const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            maxPoolSize: 10,
        });
        console.log("Kết nối MongoDB thành công");
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error);
        throw error;
    }
}

const connectWithRetry = async () => {
    console.log("Đang thử kết nối MongoDB...");
    try {
        await connectDB();
    } catch (error) {
        console.error("Thử lại sau 5 giây...");
        setTimeout(connectWithRetry, 5000);
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB đã ngắt kết nối. Đang thử kết nối lại...");
    connectWithRetry();
});

module.exports = connectWithRetry;