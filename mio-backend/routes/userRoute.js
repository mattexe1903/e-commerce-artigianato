const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/userMiddleware');

// Route restituzione informazioni utente
router.get('/user', protect,  userController.getUserInfo);

router.get('/userInfo', protect, userController.getUserInformation);

router.get('/user/:id/infoartigiani', protect, userController.getArtigianiInfo);

router.get('/addAddress', protect, userController.addUserAddress);

module.exports = router;