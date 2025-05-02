const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const pool = require('../db');

// Route per ottenere tutti i prodotti
router.get('/products', productController.getAllProducts);

// Route per ottenere un prodotto specifico
router.get('/products/:id', productController.getProductById);

// Route per creare un nuovo prodotto
router.post('/products', productController.createProduct);

// Route per aggiornare un prodotto esistente
router.put('/products/:id', productController.updateProduct);

// Route per eliminare un prodotto
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;