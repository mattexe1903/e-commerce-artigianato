const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/userMiddleware');

router.post('/createOrder', protect, orderController.createOrder);

router.get('/getOrdersByUserId', protect, orderController.getOrdersByUserId);

module.exports = router;