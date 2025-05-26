const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;

// Serve file statici dalle rispettive cartelle
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'html')));

// Serve la pagina iniziale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'home.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on http://localhost:${PORT}`);
});
