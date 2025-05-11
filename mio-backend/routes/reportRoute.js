const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/sendArtisanRequest', reportController.sendArtisanRequest);

module.exports = router;