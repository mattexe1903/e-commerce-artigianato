require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const userRoutes = require('./routes/userRoute');

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('Benvenuto nel backend dell\'e-commerce!');
});

// SOLO PER TESTING: Recupera tutti gli utenti (non sicuro per produzione)
app.get('/utenti', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM utenti');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore nel recupero degli utenti');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});