const authService = require('../services/authService');

const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);

    //console.log('Dati ricevuti:', user);

    const artisan_state_raw = await authService.artisanIsActive(user.user_id);
    console.log('artisan_state:', artisan_state_raw);

    const stato = artisan_state_raw?.artisan_state;

    if (stato !== undefined && stato !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Richiesta in attesa di approvazione o rifiutata'
      });
    }

    const token = generateToken(user.user_id);
    console.log('Token generato:', token);
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

//TODO: GENERAZIONE TOKEN
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

//TODO: GENERAZIONE TOKEN
const registerArtigiano = async (req, res) => {
  console.log("Dati ricevuti nel controller:", req.body);
  const { datiBase, datiExtra } = req.body;

  console.log("datiBase:", datiBase);
  console.log("datiExtra:", datiExtra);

  const { nome, cognome, email, password } = datiBase;
  const { tipo_artigiano, iban } = datiExtra;

  try {
    const user = await authService.register(nome, cognome, email, password, 3);
    console.log('utente registrato', user);
    if (tipo_artigiano && iban) {
      console.log('userId: ', user.user_id);
      const newArtisan = await authService.saveArtigianoDetails(user.user_id, tipo_artigiano, iban);
      console.log(newArtisan);
    }

    const artisan_state = await authService.artisanIsActive(user.user_id);
    console.log('artisan_state:', artisan_state);

    if (artisan_state != 2) {
      return res.status(400).json({
        success: false,
        message: 'Richiesta in attesa di approvazione o rifiutata'
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Registrazione riuscita',
        user
      });
    }
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