const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

// Protected routes
router.post(
  '/',
  protect,
  [
    body('order_id', 'Order ID is required').not().isEmpty(),
    body('amount', 'Amount is required').isNumeric(),
    body('payment_method', 'Payment method is required').isIn(['cash', 'card', 'digital'])
  ],
  paymentController.createPayment
);

router.get('/', protect, authorize('admin', 'staff'), paymentController.getPayments);
router.get('/:id', protect, paymentController.getPaymentById);
router.put('/:id/status', protect, authorize('admin', 'staff'), paymentController.updatePaymentStatus);

module.exports = router;
