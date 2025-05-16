const reportService = require('../services/reportService');
const userService = require('../services/userService');

const sendArtisanRequest = async (req, res) => {
  try {
    const { nome, cognome, tipo_artigiano, iban } = req.body;
    const user_id = req.user.user_id;

    if (!nome || !cognome || !tipo_artigiano || !iban) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    await reportService.sendArtisanRequest(user_id, nome, cognome, tipo_artigiano, iban);

    return res.status(200).json({ message: 'Richiesta inviata con successo.' });
  } catch (error) {
    console.error('Errore durante l\'invio della richiesta:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
}

const getArtisanRequest = async (req, res) => {
  try {
    const requests = await reportService.getArtisanRequest();
    return res.status(200).json(requests);
  } catch (error) {
    console.error('Errore durante il recupero delle richieste:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
}

const updateArtisanRequest = async (req, res) => {
  try {
    const { id, action } = req.body;

    if (!id || !action) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    await reportService.updateArtisanRequest(id, action);

    return res.status(200).json({ message: 'Richiesta aggiornata con successo.' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della richiesta:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
}

const sendSignal = async (req, res) => {
  try {
    const { email, titolo, messaggio, stato } = req.body;

    if (!email || !titolo || !messaggio || !stato) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    const userId = user.user_id;

    await reportService.sendSignal(userId, titolo, messaggio, stato);

    return res.status(200).json({ message: 'Segnalazione inviata con successo.' });
  } catch (error) {
    console.error('Errore durante l\'invio della segnalazione:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
};

const getSignal = async (req, res) => {
  try {
    const signals = await reportService.getSignal();
    return res.status(200).json(signals);
  } catch (error) {
    console.error('Errore durante il recupero delle segnalazioni:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
};

module.exports = {
  sendArtisanRequest,
  getArtisanRequest,
  updateArtisanRequest,
  sendSignal,
  getSignal
}