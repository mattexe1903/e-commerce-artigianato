const reportService = require('../services/reportService');

const sendArtisanRequest = async (req, res) => {
    try {
        const { nome, cognome, tipo_artigiano, iban } = req.body;
        console.log('Ricevuta richiesta segnalazione:', req.body);
        
        if (!nome || !cognome || !tipo_artigiano || !iban) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
        }

        await reportService.sendArtisanRequest(nome, cognome, tipo_artigiano, iban);

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

module.exports = {
    sendArtisanRequest, 
    getArtisanRequest
};