const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const paymentController = require('../controllers/paymentController');
const verifyMidtrans = require('../middleware/verifyMidtrans');
const idempotencyCache = require('../utils/idempotency');

const router = express.Router();

// Webhook Midtrans
router.post(
  '/midtrans-webhook',
  express.json({ type: 'application/json' }),
  verifyMidtrans,
  paymentController.handleMidtransWebhook
);

// Proses pembayaran
router.post(
  '/process',
  [
    protect,
    authorize('staff', 'owner'),
    body('orderId').isInt().withMessage('ID Pesanan harus berupa angka'),
    body('amount').isFloat({ min: 0 }).withMessage('Jumlah tidak valid'),
    body('paymentMethod').isIn(['cash', 'qris', 'manual']).withMessage('Metode pembayaran tidak valid'),
    validate
  ],
  paymentController.preventReplay,
  paymentController.validatePaymentAmount,
  paymentController.processPayment
);

// Rute yang sudah ada
router.get('/:id', protect, paymentController.getPayment);
router.post('/guest/qris', paymentController.createGuestQrisPayment);
router.post('/guest/manual', paymentController.createGuestManualPayment);

module.exports = router;