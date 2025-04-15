const mongoose = require('mongoose');

// Định nghĩa các schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
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
module.exports = {
    User: mongoose.models.User || mongoose.model('User', userSchema),
    Dish: mongoose.models.Dish || mongoose.model('Dish', dishSchema),
    Order: mongoose.models.Order || mongoose.model('Order', orderSchema),
    Contact: mongoose.models.Contact || mongoose.model('Contact', contactSchema),
    News: mongoose.models.News || mongoose.model('News', newsSchema),
};