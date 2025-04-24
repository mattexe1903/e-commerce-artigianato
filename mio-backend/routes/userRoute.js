const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const pool = require('../db');

// Route restituzione informazioni utente
router.get('/user/:id', userController.getUserInfo);


module.exports = router;