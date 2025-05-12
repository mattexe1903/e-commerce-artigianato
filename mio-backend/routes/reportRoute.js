const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/sendArtisanRequest', reportController.sendArtisanRequest);

router.get('/getArtisanRequest', reportController.getArtisanRequest);

router.post('/updateArtisanRequest', reportController.updateArtisanRequest);

router.post('/sendSignal', reportController.sendSignal);

module.exports = router;