const express = require('express');
const { body, param } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  processPayment,
  getPayment,
  paymentWebhook
} = require('../controllers/paymentController');

const router = express.Router();

// Public webhook endpoint (no authentication required for webhooks)
router.post('/webhook', paymentWebhook);

// Protected routes (require authentication)
router.use(protect);

// Process payment
router.post('/process', [
  body('orderId', 'Order ID is required').isInt(),
  body('paymentMethod', 'Payment method is required').isIn(['cash', 'midtrans']),
  body('paymentDetails', 'Payment details must be an object').optional().isObject()
], validate, processPayment);

// Get payment details
router.get('/:id', [
  param('id', 'Please provide a valid payment ID').isInt()
], validate, getPayment);

module.exports = router;
