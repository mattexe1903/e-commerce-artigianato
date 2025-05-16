const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/userMiddleware');

router.post('/createOrder', protect, orderController.createOrder);

router.get('/getOrdersByUserId', protect, orderController.getOrdersByUserId);

router.get('/getOrdersByArtisanId', protect, orderController.getOrdersByArtisanId);

router.get('/sales', orderController.getSales);

router.get('/salesByArtisanId', protect, orderController.getDailySalesByArtisan);



module.exports = router;