const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route login
router.post('/login', authController.login);

// Route registrazione cliente
router.post('/register', authController.register);

// Route registrazione artigiano
router.post('/registerArtigiano', authController.registerArtigiano);

module.exports = router;