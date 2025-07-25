const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premiumController');
const authenticate = require('../middleware/authenticate');

// Get leaderboard (Only for premium users)
router.get('/leaderboard', authenticate, premiumController.getLeaderboard);

module.exports = router;
