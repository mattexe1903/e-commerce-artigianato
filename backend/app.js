require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'images')));

const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const userRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cartRoute');
const categoryRoutes = require('./routes/categoryRoute');
const orderRoutes = require('./routes/orderRoute');
const reportRoutes = require('./routes/reportRoute');

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', cartRoutes);
app.use('/api', categoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', reportRoutes);

app.get('/', (req, res) => {
  res.send('Benvenuto nel backend dell\'e-commerce!');
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'reset-password.html'));
});

module.exports = app;