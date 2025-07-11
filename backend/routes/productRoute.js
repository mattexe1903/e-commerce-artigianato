const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const productController = require('../controllers/productController');
const favouriteController = require('../controllers/favouriteController');
const { protect } = require('../middleware/userMiddleware');

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

// Route per aggiungere un prodotto ai preferiti
router.post('/addToFavourites', protect, favouriteController.addProductToFavourites);

// Route per rimuovere un prodotto dai preferiti
router.delete('/removeFromFavourites', protect, favouriteController.removeProductFromFavourites);

// Route per ottenere tutti i prodotti preferiti dell'utente
router.get('/favourites', protect, favouriteController.getAllFavourites);

// Route per ottenere i prodotti più recenti
router.get('/latest', productController.getLatestProducts);

module.exports = router;