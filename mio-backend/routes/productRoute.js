const express = require('express');
const router = express.Router();
const authController = require('../controllers/productController');
const pool = require('../db');

// Route per ottenere tutti i prodotti
router.get('/produtcs', productController.getAllProducts);

module.exports = router;