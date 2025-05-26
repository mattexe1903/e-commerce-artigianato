const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/userMiddleware');

// Route eper inviare la richiesta di approvazione di un artigiano
router.post('/sendArtisanRequest', protect, reportController.sendArtisanRequest);

// Route per ottenere tutte le richieste di approvazione degli artigiani
router.get('/getArtisanRequest', reportController.getArtisanRequest);

// Route per modificare lo stato della richiesta di approvazione dell'artigiano
router.post('/updateArtisanRequest', reportController.updateArtisanRequest);

// Route per inviare segnalazioni
router.post('/sendSignal', reportController.sendSignal);

// Route per ottenere tutte le segnalazioni
router.get('/getSignal', reportController.getSignal);

module.exports = router;