const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Usa il middleware centralizzato
const productController = require('../controllers/productController');

// Route per ottenere tutti i prodotti
router.get('/products', productController.getAllProducts);

// Route per ottenere un prodotto specifico
router.get('/products/:id', productController.getProductById);

// Route per creare un nuovo prodotto con immagine
router.post('/products', upload.single('photo'), productController.createProduct);

// Route per aggiornare un prodotto esistente
router.put('/products/:id', productController.updateProduct);

// Route per aggiornare solo la foto del prodotto
router.patch('/products/:id/photo', upload.single('photo'), productController.updateProductPhoto);

// Route per eliminare un prodotto
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
