const app = require('./app'); // importa app separata
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});