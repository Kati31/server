const mongoose = require('mongoose');
const { Dish } = require('./models');

mongoose.connect('mongodb://127.0.0.1:27017/amthuctruyenthong', {
    serverSelectionTimeoutMS: 5000,
}).then(() => console.log('MongoDB connected'));

const dishes = [
    { name: 'Phở Bò Hà Nội', category: 'Bắc', price: 50000, description: 'Nước dùng thơm, bánh phở mềm, thịt bò ngọt.', history: 'Phở ra đời đầu thế kỷ 20 ở Hà Nội.', image: 'pho-bo.jpg' },
    { name: 'Bún Chả Hà Nội', category: 'Bắc', price: 45000, description: 'Thịt nướng thơm, nước mắm chua ngọt.', history: 'Món ăn đặc trưng Hà Nội.', image: 'bun-cha.jpg' },
    { name: 'Bún Bò Huế', category: 'Trung', price: 55000, description: 'Nước dùng cay nồng, bún to, thịt bò mềm.', history: 'Món ăn nổi tiếng ở Huế.', image: 'bun-bo-hue.jpg' },
    { name: 'Mì Quảng', category: 'Trung', price: 40000, description: 'Sợi mì dai, nước dùng đậm đà, tôm thịt.', history: 'Đặc sản Quảng Nam.', image: 'mi-quang.jpg' },
    { name: 'Bánh Xèo Miền Tây', category: 'Nam', price: 35000, description: 'Bánh giòn, nhân tôm thịt, ăn kèm rau.', history: 'Món ăn dân dã miền Tây.', image: 'banh-xeo.jpg' },
    { name: 'Cơm Tấm Sài Gòn', category: 'Nam', price: 45000, description: 'Tấm thơm, sườn nướng, trứng ốp la.', history: 'Món ăn quen thuộc Sài Gòn.', image: 'com-tam.jpg' },
    { name: 'Bún Riêu Cua', category: 'Bắc', price: 40000, description: 'Nước dùng chua nhẹ, riêu cua béo.', history: 'Món ăn dân dã miền Bắc.', image: 'bun-rieu.jpg' },
    { name: 'Chả Cá Lã Vọng', category: 'Bắc', price: 60000, description: 'Cá lăng nướng, ăn với bún và rau thơm.', history: 'Đặc sản Hà Nội từ thế kỷ 19.', image: 'cha-ca.jpg' },
    { name: 'Cao Lầu Hội An', category: 'Trung', price: 45000, description: 'Sợi mì dai, thịt heo, rau sống.', history: 'Món ăn nổi tiếng Hội An.', image: 'cao-lau.jpg' },
    { name: 'Bánh Căn Phan Thiết', category: 'Trung', price: 30000, description: 'Bánh căn giòn, topping tôm mực.', history: 'Món ăn đường phố Phan Thiết.', image: 'banh-can.jpg' },
    { name: 'Hủ Tiếu Nam Vang', category: 'Nam', price: 50000, description: 'Nước dùng ngọt, hủ tiếu dai, tôm thịt.', history: 'Món ăn gốc Campuchia, phổ biến ở Sài Gòn.', image: 'hu-tieu.jpg' },
    { name: 'Bánh Mì Sài Gòn', category: 'Nam', price: 25000, description: 'Bánh mì giòn, pate, thịt, rau.', history: 'Món ăn đường phố nổi tiếng thế giới.', image: 'banh-mi.jpg' },
    { name: 'Gỏi Cuốn', category: 'Nam', price: 30000, description: 'Bánh tráng cuốn tôm, thịt, rau.', history: 'Món ăn nhẹ phổ biến miền Nam.', image: 'goi-cuon.jpg' },
    { name: 'Bún Mắm', category: 'Nam', price: 45000, description: 'Nước dùng mắm thơm, cá, tôm, mực.', history: 'Đặc sản miền Tây.', image: 'bun-mam.jpg' },
    { name: 'Nem Nướng Nha Trang', category: 'Trung', price: 40000, description: 'Nem nướng thơm, cuốn bánh tráng.', history: 'Đặc sản Nha Trang.', image: 'nem-nuong.jpg' },
    { name: 'Bánh Tráng Nướng Đà Lạt', category: 'Trung', price: 20000, description: 'Bánh tráng nướng giòn, trứng, hành.', history: 'Món ăn vặt Đà Lạt.', image: 'banh-trang-nuong.jpg' },
    { name: 'Phở Gà', category: 'Bắc', price: 45000, description: 'Nước dùng trong, thịt gà ta dai.', history: 'Biến tấu của phở bò.', image: 'pho-ga.jpg' },
    { name: 'Bánh Bèo Huế', category: 'Trung', price: 25000, description: 'Bánh bèo mềm, topping tôm, đậu phộng.', history: 'Món ăn vặt Huế.', image: 'banh-beo.jpg' },
    { name: 'Canh Chua Cá Lóc', category: 'Nam', price: 50000, description: 'Canh chua ngọt, cá lóc tươi, rau.', history: 'Món ăn gia đình miền Tây.', image: 'canh-chua.jpg' },
    { name: 'Bún Ốc', category: 'Bắc', price: 40000, description: 'Nước dùng chua nhẹ, ốc giòn.', history: 'Món ăn dân dã Hà Nội.', image: 'bun-oc.jpg' },
];

const addDishes = async () => {
    try {
        await Dish.deleteMany({});
        await Dish.insertMany(dishes);
        console.log('Dishes added successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

addDishes();