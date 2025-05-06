const authService = require('../services/authService');

const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    const token = generateToken(user.user_id);
    res.status(200).json({
      success: true,
      message: 'Login riuscito',
      token,
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
  const { nome, cognome, email, password, conferma} = req.body;

  if (password !== conferma) {
    return res.status(400).json({
      success: false,
      message: 'Le password non coincidono'
    });
  }

  try {
    const user = await authService.register(nome, cognome, email, password, 2);
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


const registerArtigiano = async (req, res) => {
  const { nome, cognome, email, password, tipo_artigiano, iban } = req.body;

  try {
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Questa email è già registrata.'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Errore durante la verifica dell\'email.'
    });
  }

  try {
    const user = await authService.register(nome, cognome, email, password, 3);

    if (tipo_artigiano && iban) {
      await authService.saveArtigianoDetails(user.id, tipo_artigiano, iban);
    }

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


// JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  login,
  register,
  registerArtigiano
};