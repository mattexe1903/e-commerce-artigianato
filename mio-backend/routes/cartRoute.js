const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/userMiddleware');

// ottieni il carrello di un utente specifico
router.get('/cart', protect, cartController.getCartInfo);

// aggiungi un prodotto al carrello
router.post('/cart/add', protect, cartController.addToCart);

// rimuovi un prodotto dal carrello
router.delete('/cart/remove', protect, cartController.removeFromCart);

// svuota tutto il carrello
router.delete('/cart/clear', protect, cartController.clearCart);

module.exports = router;