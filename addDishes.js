const connectWithRetry = require("./db");
const mongoose = require("mongoose"); // Thêm import mongoose
const { Dish } = require("./models");

const dishes = [
    { name: "Phở Bò Hà Nội", category: "Bắc", price: 50000, description: "Nước dùng thơm, bánh phở mềm, thịt bò ngọt.", history: "Phở ra đời đầu thế kỷ 20 ở Hà Nội.", image: "pho-bo.jpg" },
    { name: "Bún Chả Hà Nội", category: "Bắc", price: 45000, description: "Thịt nướng thơm, nước mắm chua ngọt.", history: "Món ăn đặc trưng Hà Nội.", image: "bun-cha.jpg" },
    { name: "Bánh Mì Sài Gòn", category: "Nam", price: 30000, description: "Bánh mì giòn, pate thơm, rau sống tươi.", history: "Món ăn đường phố nổi tiếng Sài Gòn.", image: "banh-mi.jpg" },
    { name: "Hủ Tiếu Nam Vang", category: "Nam", price: 40000, description: "Nước dùng ngọt, hủ tiếu dai, tôm thịt tươi.", history: "Món ăn gốc Campuchia, phổ biến ở miền Nam.", image: "hu-tieu.jpg" },
    { name: "Bún Bò Huế", category: "Trung", price: 50000, description: "Nước dùng cay, bún to, thịt bò mềm.", history: "Món ăn đặc trưng của Huế.", image: "bun-bo-hue.jpg" },
    { name: "Mì Quảng", category: "Trung", price: 40000, description: "Mì gạo dẹt, nước dùng đậm đà, rau sống tươi.", history: "Món ăn truyền thống Quảng Nam.", image: "mi-quang.jpg" },
    { name: "Cao Lầu Hội An", category: "Trung", price: 45000, description: "Sợi mì dai, thịt heo, rau sống, nước dùng đặc biệt.", history: "Món ăn nổi tiếng Hội An.", image: "cao-lau.jpg" },
    { name: "Bánh Xèo Miền Tây", category: "Nam", price: 35000, description: "Bánh xèo giòn, tôm thịt, giá đỗ, rau sống.", history: "Món ăn dân dã miền Tây.", image: "banh-xeo.jpg" },
    { name: "Gỏi Cuốn Tôm Thịt", category: "Nam", price: 25000, description: "Bánh tráng mềm, tôm thịt, rau sống, chấm mắm nêm.", history: "Món ăn nhẹ phổ biến miền Nam.", image: "goi-cuon.jpg" },
    { name: "Chả Cá Lã Vọng", category: "Bắc", price: 60000, description: "Cá lăng nướng, ăn với bún, rau thơm, mắm tôm.", history: "Món ăn đặc sản Hà Nội.", image: "cha-ca.jpg" },
    { name: "Bánh Cuốn Thanh Trì", category: "Bắc", price: 30000, description: "Bánh cuốn mỏng, nhân thịt băm, mộc nhĩ.", history: "Món ăn truyền thống Hà Nội.", image: "banh-cuon.jpg" },
    { name: "Nem Chua Thanh Hóa", category: "Trung", price: 20000, description: "Nem chua lên men tự nhiên, vị chua nhẹ, cay.", history: "Món ăn đặc sản Thanh Hóa.", image: "nem-chua.jpg" },
    { name: "Bún Riêu Cua", category: "Bắc", price: 40000, description: "Nước dùng chua ngọt, riêu cua, đậu phụ, cà chua.", history: "Món bún dân dã miền Bắc.", image: "bun-rieu.jpg" },
    { name: "Lẩu Mắm Miền Tây", category: "Nam", price: 80000, description: "Lẩu mắm đậm đà, cá, tôm, rau đa dạng.", history: "Món ăn đặc trưng miền Tây.", image: "lau-mam.jpg" },
    { name: "Bánh Chưng", category: "Bắc", price: 50000, description: "Gạo nếp, đậu xanh, thịt lợn, gói lá dong.", history: "Món ăn truyền thống ngày Tết.", image: "banh-chung.jpg" },
    { name: "Bánh Giò", category: "Bắc", price: 20000, description: "Bột gạo, nhân thịt băm, mộc nhĩ, gói lá chuối.", history: "Món ăn sáng phổ biến miền Bắc.", image: "banh-gio.jpg" },
    { name: "Cơm Tấm Sườn Nướng", category: "Nam", price: 45000, description: "Cơm tấm dẻo, sườn nướng thơm, trứng ốp la.", history: "Món ăn đặc trưng Sài Gòn.", image: "com-tam.jpg" },
    { name: "Bánh Canh Cua", category: "Nam", price: 50000, description: "Bánh canh dai, nước dùng cua ngọt, chả cá.", history: "Món ăn phổ biến miền Nam.", image: "banh-canh-cua.jpg" },
    { name: "Bánh Bò Thốt Nốt", category: "Nam", price: 15000, description: "Bánh bò ngọt, làm từ đường thốt nốt, dừa nạo.", history: "Món tráng miệng miền Tây.", image: "banh-bo.jpg" },
    { name: "Bánh Ướt Lòng Gà", category: "Trung", price: 35000, description: "Bánh ướt mềm, lòng gà, rau thơm, nước mắm.", history: "Món ăn đặc sản Đà Lạt.", image: "banh-uot-long-ga.jpg" },
];

// Đợi kết nối thành công trước khi thực hiện các thao tác
async function initializeDishes() {
    try {
        // Đợi kết nối MongoDB thành công
        await connectWithRetry();
        
        // Kiểm tra trạng thái kết nối
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection not established");
        }

        console.log("Bắt đầu thêm dữ liệu món ăn...");
        await Dish.deleteMany({});
        await Dish.insertMany(dishes);
        console.log("Dishes added successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

// Gọi hàm khởi tạo
initializeDishes();