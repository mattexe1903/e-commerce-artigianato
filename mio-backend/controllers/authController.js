const authService = require('../services/authService');
const reportService = require('../services/reportService');

const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    console.log(user);

    const artisan_state_raw = await authService.artisanIsActive(user.user_id);
    const stato = artisan_state_raw?.artisan_state;
    if (stato !== undefined && stato !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Richiesta in attesa di approvazione o rifiutata'
      });
    }

    const token = generateToken(user.user_id);
    res.status(200).json({
      success: true,
      message: 'Login riuscito',
      token,
      user_role: user.user_role
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || 'Credenziali non valide'
    });
  }
};

const register = async (req, res) => {
  const { nome, cognome, email, password, conferma } = req.body;
  if (password !== conferma) {
    return res.status(400).json({
      success: false,
      message: 'Le password non coincidono'
    });
  }

  try {
    const user = await authService.register(nome, cognome, email, password, 2);
    const token = generateToken(user.user_id);
    res.status(201).json({
      success: true,
      message: 'Registrazione riuscita',
      token
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Errore nella registrazione'
    });
  }
};


const registerArtigiano = async (req, res) => {
  const { datiBase, datiExtra } = req.body;
  const { nome, cognome, email, password } = datiBase;
  const { tipo_artigiano, iban } = datiExtra;

  try {
    const user = await authService.register(nome, cognome, email, password, 3);

    if (tipo_artigiano && iban) {
      await authService.saveArtigianoDetails(user.user_id, tipo_artigiano, iban);
    }
    
    //TODO: Invia la richiesta di registrazione
    await reportService.sendArtisanRequest(user.user_id, nome, cognome, tipo_artigiano, iban);

    res.status(201).json({
      success: true,
      message: 'Registrazione riuscita',
      user
    });
  } catch (err) {
    console.error('Errore durante la registrazione dell\'artigiano:', err);
    res.status(500).json({
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