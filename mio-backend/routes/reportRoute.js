const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/userMiddleware');


router.post('/sendArtisanRequest', protect, reportController.sendArtisanRequest);

router.get('/getArtisanRequest', reportController.getArtisanRequest);

router.post('/updateArtisanRequest', reportController.updateArtisanRequest);

router.post('/sendSignal', reportController.sendSignal);

router.get('/getSignal', reportController.getSignal);

module.exports = router;