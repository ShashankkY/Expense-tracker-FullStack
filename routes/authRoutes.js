const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// User registration
router.post('/signup', authController.signup);

// User login
router.post('/login', authController.login);

// Get user profile (protected route)
router.get('/profile', authenticate, authController.getProfile);

// Upgrade to premium without payment (protected route)
router.post('/upgrade', authenticate, authController.upgradeToPremium);

module.exports = router;
