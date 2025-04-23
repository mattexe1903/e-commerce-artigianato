const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');

app.use('/api', authRoutes);
app.use('/api', productRoutes);

app.get('/', (req, res) => {
    res.send('Benvenuto nel backend dell\'e-commerce!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});