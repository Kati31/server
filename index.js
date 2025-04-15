const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsRoutes = require('./routes/newsRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/amthuctruyenthong', {
    serverSelectionTimeoutMS: 5000,
}).then(() => console.log('MongoDB connected'));

app.use('/api/users', userRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/news', newsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));