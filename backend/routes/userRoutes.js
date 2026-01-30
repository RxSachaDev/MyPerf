const express = require('express');
const router = express.Router();
const { User } = require('../models');
const userController = require('../controllers/userController');

// Routes publiques
router.post('/api/auth/register', userController.register)

// Routes pour les utilisateurs

module.exports = router;