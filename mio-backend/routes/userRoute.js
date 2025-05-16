const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/userMiddleware');

// Route restituzione informazioni utente
router.get('/user', protect,  userController.getUserInfo);

// Route per ottenere le informazioni dell'utente
router.get('/userInfo', protect, userController.getUserInformation);

// Route per ottenere le informazioni extra dell'artigiano
router.get('/user/:id/infoartigiani', protect, userController.getArtigianiInfo);

// Route per inviare la mail di reset della password
router.post('/send-reset-email', userController.sendResetEmail);

// Route per reimpostare la password
router.post('/reset-password', userController.resetPassword);

// Route per aggiungere un nuovo indirizzo ad un utente
router.get('/addAddress', protect, userController.addUserAddress);

// Route per ottenere l'inventario di un artigiano
router.get('/getInventory', protect, userController.getInventory);

// Route per ottenere tutte le informazioni di un artigiano
router.get('/getArtisanRegistered', userController.getArtisanRegistered);

// Route per la rimozionedi un artigiano
router.delete('/artisan/:id', userController.deleteArtisan);

module.exports = router;