const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pool = require('../db');

// Route login
router.post('/login', authController.login);

// Route registrazione cliente
router.post('/register', authController.register);

// Route registrazione artigiano
router.post('/registerArtigiano', authController.registerArtigiano);

// Route recupero password
router.post('/recoverPassword', authController.recoverPassword);

module.exports = router;