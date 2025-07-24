const express = require('express');
const router = express.Router();
const {createOrder,paymentStatus} = require('../controllers/paymentController');
const authenticate = require('../middleware/authenticate');

// ✅ Create Cashfree order (Protected route)
router.post('/create-order', authenticate, createOrder);

// ✅ Verify payment status (auto-called via Cashfree return_url)
router.get('/status/:orderId', paymentStatus);

module.exports = router;