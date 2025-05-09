require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();

// Middleware di base
app.use(cors());
app.use(express.json());

// Servire file statici (immagini, CSS, JS, HTML)
app.use(express.static(path.join(__dirname, '..', 'WebContent')));
app.use('/images', express.static(path.join(__dirname, '..', 'WebContent', 'images')));

// Import delle routes
const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const userRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cartRoute');
const categoryRoutes = require('./routes/categoryRoute');

// Uso delle routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', cartRoutes);
app.use('/api', categoryRoutes);

// Route di base
app.get('/', (req, res) => {
  res.send('Benvenuto nel backend dell\'e-commerce!');
});

// Rotta per servire reset-password.html come /reset-password
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'WebContent', 'html', 'reset-password.html'));
});

// SOLO PER TESTING: Recupera tutti gli utenti
app.get('/utenti', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM utenti');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore nel recupero degli utenti');
  }
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
