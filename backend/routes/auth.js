const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Sign Up route
router.post('/signup', authController.signup);

// Sign In route
router.post('/signin', authController.signin);

module.exports = router;
