require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS per frontend su porta 5500
app.use(cors({
  origin: 'http://localhost:5500'
}));

app.use(express.json());

// 🔥 Serve immagini dalla cartella montata dal volume Docker
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Rotte API
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

// 🔧 Route base
app.get('/', (req, res) => {
  res.send('Benvenuto nel backend dell\'e-commerce!');
});

// 🔧 Reset password (serve HTML statico, solo se necessario)
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'reset-password.html'));
});

module.exports = app;
