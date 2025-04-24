const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const pool = require('../db');

// Route per ottenere tutti i prodotti
router.get('/produtcs', productController.getAllProducts);

// Route per ottenere un prodotto specifico
router.get('/produtcs/:id', productController.getProductById);

// Route per creare un nuovo prodotto
router.post('/produtcs', productController.createProduct);

// Route per aggiornare un prodotto esistente
router.put('/produtcs/:id', productController.updateProduct);

// Route per eliminare un prodotto
router.delete('/produtcs/:id', productController.deleteProduct);

module.exports = router;