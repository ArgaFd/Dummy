const express = require('express');
const { body, param, query } = require('express-validator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getOrders,
  updateOrderStatus,
  confirmManualPayment,
  getReceipt,
} = require('../controllers/staffController');

const router = express.Router();

router.use(protect);
router.use(authorize('staff', 'owner'));;

// List orders with optional status filter and pagination
router.get('/orders', [
  query('status').optional().isIn(['pending','accepted','preparing','ready','completed','cancelled']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], validate, getOrders);

// Update order status
router.put('/orders/:id/status', [
  param('id', 'Order ID is required').isInt(),
  body('status', 'Status is required').isIn(['pending','accepted','preparing','ready','completed','cancelled'])
], validate, updateOrderStatus);

// Confirm manual payment
router.post('/payments/manual/:id/confirm', [
  param('id', 'Order ID is required').isInt()
], validate, confirmManualPayment);

// Get receipt (simple JSON view)
router.get('/orders/:id/receipt', [
  param('id', 'Order ID is required').isInt()
], validate, getReceipt);

module.exports = router;
