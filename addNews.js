const mongoose = require('mongoose');
const { News } = require('./models');

mongoose.connect('mongodb://127.0.0.1:27017/amthuctruyenthong', {
    serverSelectionTimeoutMS: 5000,
}).then(() => console.log('MongoDB connected'));

const news = [
    // Danh sách tin tức như trước
    {
        title: 'Phở Việt Nam – Hành trình từ gánh hàng rong đến thế giới',
        content: 'Phở, món ăn biểu tượng của Việt Nam, ra đời từ đầu thế kỷ 20 ở Hà Nội...',
        date: new Date('2025-04-01'),
    },
    // ... (giữ nguyên các bài khác)
];

const addNews = async () => {
    try {
        await News.deleteMany({});
        await News.insertMany(news);
        console.log('News added successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

addNews();