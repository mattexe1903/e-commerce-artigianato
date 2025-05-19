const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/userMiddleware');

// Route per creare un nuovo ordine
router.post('/createOrder', protect, orderController.createOrder);

// Route per ottenere tutti gli ordini di un utente
router.get('/getOrdersByUserId', protect, orderController.getOrdersByUserId);

// Route per ottenere tutti gli ordini di un artigiano
router.get('/getOrdersByArtisanId', protect, orderController.getOrdersByArtisanId);

// Route per ottenere tutti gli ordini
router.get('/sales', orderController.getSales);

// Route per ottenere gli ordini di un artigiano
router.get('/salesByArtisanId', protect, orderController.getDailySalesByArtisan);

module.exports = router;