const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Restituisce tutte le categorie
router.get('/categories', categoryController.getAllCategories);

// restituisce tutto il contenuto della tabella categories
router.get('/categories-info', categoryController.getAllCategoriesInfo);

module.exports = router;