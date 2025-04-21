const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('../db');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('../routes/authRoute');
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('Benvenuto nel backend dell\'e-commerce!');
});

// API di test - prende tutti gli utenti
app.get('/api/utenti', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM utenti');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore nel server');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});