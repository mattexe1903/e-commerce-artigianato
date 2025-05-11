const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route to get all categories
router.get('/categories', categoryController.getAllCategories);

router.get('/categories-info', categoryController.getAllCategoriesInfo);

module.exports = router;