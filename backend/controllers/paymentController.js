const paymentStore = require('../stores/paymentStore');
const orderStore = require('../stores/orderStore');
const { createSnapTransaction, verifyWebhookSignature } = require('../services/midtransService');

const processPayment = async (req, res) => {
  const { orderId, paymentMethod, paymentDetails } = req.body;

  const order = orderStore.getById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  if (paymentMethod === 'cash') {
    const payment = paymentStore.create({
      orderId,
      amount: order.totalAmount,
      paymentMethod: 'cash',
      provider: null,
      providerRef: null,
      status: 'paid',
    });

    return res.json({ success: true, data: { payment } });
  }

  if (paymentMethod === 'midtrans') {
    const mt = await createSnapTransaction({
      orderId: `order-${order.id}-${Date.now()}`,
      grossAmount: order.totalAmount,
      customerDetails: paymentDetails && paymentDetails.customer ? paymentDetails.customer : undefined,
    });

    const payment = paymentStore.create({
      orderId: order.id,
      amount: order.totalAmount,
      paymentMethod: 'midtrans',
      provider: 'midtrans',
      providerRef: mt.order_id,
      status: 'pending',
    });

    return res.json({
      success: true,
      data: {
        payment,
        midtrans: {
          token: mt.token,
          redirect_url: mt.redirect_url,
          order_id: mt.order_id,
        },
      },
    });
  }

  return res.status(400).json({ success: false, message: 'Unsupported payment method' });
};

const getPayment = (req, res) => {
  const payment = paymentStore.getById(req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  return res.json({ success: true, data: payment });
};

// Midtrans webhook (notification handler)
const paymentWebhook = (req, res) => {
  const body = req.body || {};

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

  const ok = verifyWebhookSignature({
    orderId: order_id,
    statusCode: status_code,
    grossAmount: gross_amount,
    signatureKey: signature_key,
  });

  if (!ok) {
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }

  let newStatus = 'pending';
  if (transaction_status === 'settlement' || transaction_status === 'capture') {
    newStatus = fraud_status === 'challenge' ? 'pending' : 'paid';
  } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
    newStatus = 'failed';
  } else if (transaction_status === 'refund' || transaction_status === 'chargeback') {
    newStatus = 'refunded';
  }

  const updated = paymentStore.updateStatusByProviderRef(order_id, newStatus);

  return res.json({ success: true, data: { updated: Boolean(updated), status: newStatus } });
};

module.exports = {
  processPayment,
  getPayment,
  paymentWebhook,
};
