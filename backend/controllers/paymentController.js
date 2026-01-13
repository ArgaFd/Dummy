const mongoose = require('mongoose');
const Payment = require('../models/payment');
const Order = require('../models/order');
const AuditLog = require('../models/AuditLog');
const { getNextSequence } = require('../services/sequence');
const { createSnapTransaction } = require('../services/midtransService');

const validatePaymentAmount = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const order = await Order.findOne({ id: orderId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pesanan tidak ditemukan' 
      });
    }

    const tolerance = order.totalAmount * 0.1;
    if (Math.abs(amount - order.totalAmount) > tolerance) {
      await AuditLog.create({
        action: 'PAYMENT_AMOUNT_MISMATCH',
        entity: 'Order',
        entityId: order._id,
        oldValue: order.totalAmount,
        newValue: amount,
        ipAddress: req.ip
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Jumlah pembayaran tidak sesuai dengan total pesanan' 
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

const nonceStore = new Map();
const preventReplay = (req, res, next) => {
  const nonce = req.headers['x-nonce'];
  const timestamp = req.headers['x-timestamp'];
  
  if (!nonce || !timestamp) {
    return res.status(400).json({ 
      success: false, 
      message: 'Header keamanan tidak lengkap' 
    });
  }

  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  if (parseInt(timestamp) < fiveMinutesAgo) {
    return res.status(400).json({ 
      success: false, 
      message: 'Permintaan kedaluwarsa' 
    });
  }

  const requestId = `${req.ip}:${nonce}`;
  if (nonceStore.has(requestId)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Permintaan duplikat terdeteksi' 
    });
  }

  nonceStore.set(requestId, true);
  setTimeout(() => nonceStore.delete(requestId), 5 * 60 * 1000);
  
  next();
};

const handleMidtransWebhook = async (req, res) => {
  try {
    const { order_id: orderId, transaction_status: status, fraud_status: fraudStatus } = req.paymentStatus;
    
    await AuditLog.create({
      action: 'PAYMENT_WEBHOOK_RECEIVED',
      entity: 'Payment',
      entityId: orderId,
      newValue: JSON.stringify(req.paymentStatus),
      ipAddress: req.ip
    });

    const payment = await Payment.findOneAndUpdate(
      { orderId: parseInt(orderId) },
      { 
        status: status.toLowerCase(),
        isFraud: fraudStatus === 'deny',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    if (status === 'capture' || status === 'settlement') {
      await Order.findOneAndUpdate(
        { id: parseInt(orderId) },
        { status: 'completed' }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error memproses webhook:', error);
    res.status(500).json({ success: false, message: 'Kesalahan server internal' });
  }
};

const processPayment = async (req, res, next) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;
    const userId = req.user?.id;

    const order = await Order.findOne({ id: Number(orderId) }).lean();
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pesanan tidak ditemukan' 
      });
    }

    const id = await getNextSequence('payment');
    const payment = await Payment.create({
      id,
      orderId: Number(orderId),
      amount: Number(order.totalAmount),
      paymentMethod,
      status: paymentMethod === 'manual' ? 'pending' : 'processing',
      provider: paymentMethod === 'qris' ? 'midtrans' : null,
      providerRef: null,
      details: paymentDetails ? JSON.stringify(paymentDetails) : null,
      processedBy: userId || null
    });

    await AuditLog.create({
      userId: userId ? new mongoose.Types.ObjectId(userId) : null,
      action: 'PAYMENT_CREATED',
      entity: 'Payment',
      entityId: payment.id,
      newValue: JSON.stringify({
        orderId: payment.orderId,
        amount: payment.amount,
        method: payment.paymentMethod
      }),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({
      success: true,
      data: {
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ id: Number(req.params.id) });
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pembayaran tidak ditemukan' 
      });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengambil data pembayaran' 
    });
  }
};

const createGuestQrisPayment = async (req, res) => {
  try {
    const { orderId, customer } = req.body;
    const order = await Order.findOne({ id: Number(orderId) }).lean();
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pesanan tidak ditemukan' 
      });
    }

    const mt = await createSnapTransaction({
      orderId: `order-${order.id}-${Date.now()}`,
      grossAmount: order.totalAmount,
      customerDetails: customer || undefined,
    });

    const id = await getNextSequence('payment');
    const payment = await Payment.create({
      id,
      orderId: Number(order.id),
      amount: Number(order.totalAmount),
      paymentMethod: 'midtrans_qris',
      provider: 'midtrans',
      providerRef: mt.order_id,
      status: 'pending',
    });

    await AuditLog.create({
      action: 'GUEST_QRIS_PAYMENT_CREATED',
      entity: 'Payment',
      entityId: payment.id,
      newValue: JSON.stringify({
        orderId: payment.orderId,
        amount: payment.amount,
        method: payment.paymentMethod
      }),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: {
        payment: payment.toObject(),
        midtrans: {
          token: mt.token,
          redirect_url: mt.redirect_url,
          order_id: mt.order_id,
        },
      },
    });
  } catch (error) {
    console.error('Error creating QRIS payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal membuat pembayaran QRIS' 
    });
  }
};

const createGuestManualPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ id: Number(orderId) }).lean();
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pesanan tidak ditemukan' 
      });
    }

    const existing = await Payment.findOne({ 
      orderId: Number(orderId), 
      status: { $in: ['pending', 'paid'] } 
    }).lean();

    if (existing) {
      return res.json({ 
        success: true, 
        data: { payment: existing } 
      });
    }

    const id = await getNextSequence('payment');
    const payment = await Payment.create({
      id,
      orderId: Number(orderId),
      amount: Number(order.totalAmount),
      paymentMethod: 'manual',
      provider: null,
      providerRef: null,
      status: 'pending',
    });

    await AuditLog.create({
      action: 'GUEST_MANUAL_PAYMENT_CREATED',
      entity: 'Payment',
      entityId: payment.id,
      newValue: JSON.stringify({
        orderId: payment.orderId,
        amount: payment.amount,
        method: payment.paymentMethod
      }),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ 
      success: true, 
      data: { payment: payment.toObject() } 
    });
  } catch (error) {
    console.error('Error creating manual payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal membuat pembayaran manual' 
    });
  }
};

module.exports = {
  processPayment,
  validatePaymentAmount,
  preventReplay,
  handleMidtransWebhook,
  getPayment,
  createGuestQrisPayment,
  createGuestManualPayment
};