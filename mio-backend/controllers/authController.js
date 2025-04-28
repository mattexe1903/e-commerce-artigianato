const authService = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login riuscito',
      user
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || 'Credenziali non valide'
    });
  }
};

const register = async (req, res) => {
  const { nome, cognome, email, password, conferma, indirizzo } = req.body;

  if (password !== conferma) {
    return res.status(400).json({
      success: false,
      message: 'Le password non coincidono'
    });
  }

  try {
    const user = await authService.register(nome, cognome, email, password, 'cliente', indirizzo);
    res.status(201).json({
      success: true,
      message: 'Registrazione riuscita',
      user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Errore nella registrazione'
    });
  }
};


const registerArtigano = async (req, res) => {
  const { nome, cognome, email, password} = req.body;
  try {
    const user = await authService.register(nome, cognome, email, password, 'artigiano');
    res.status(201).json({
      success: true,
      message: 'Registrazione riuscita',
      user
    });
  }
  catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Errore nella registrazione'
    });
  }
};

module.exports = { 
  login, 
  register,
  registerArtigano
};