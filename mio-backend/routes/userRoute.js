const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const pool = require('../db');

// Route restituzione informazioni utente
router.get('/user/:id', userController.getUserInfo);

router.get('/user/:id/infoartigiani', userController.getArtigianiInfo);

module.exports = router;