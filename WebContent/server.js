const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Route per la home page
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'home.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Errore nel caricamento del sito:', err.message);
      res.status(500).send('Errore nel caricamento del sito.');
    } else {
      console.log('Sito caricato con successo');
    }
  });
});

// API endpoint
app.get('/data', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Avvio server
app.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
