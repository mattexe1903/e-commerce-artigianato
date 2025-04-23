const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pool = require('../db');

// Route login
router.post('/login', authController.login);

// Route per ottenere il ruolo
/*router.post('/getRuolo', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query(
      'SELECT ruolo FROM utenti WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      res.json({ ruolo: result.rows[0].ruolo });
    } else {
      res.status(404).json({ message: 'Utente non trovato' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Errore nel server' });
  }
});*/

module.exports = router;
