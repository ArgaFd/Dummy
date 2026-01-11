const orderStore = require('../stores/orderStore');
const menuStore = require('../stores/menuStore');

const createOrder = (req, res) => {
  const { tableNumber, customerName, items, paymentMethod } = req.body;

  const enrichedItems = items.map((it) => {
    const menuItem = menuStore.getById(it.menuId);
    return {
      menuId: it.menuId,
      quantity: it.quantity,
      unitPrice: menuItem ? menuItem.price : 0,
    };
  });

  const order = orderStore.create({ tableNumber, customerName, items: enrichedItems, paymentMethod });

  return res.status(201).json({ success: true, data: order });
};

const getOrders = (req, res) => {
  return res.json({ success: true, data: orderStore.getAll() });
};

const getOrder = (req, res) => {
  const order = orderStore.getById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  return res.json({ success: true, data: order });
};

const updateOrderStatus = (req, res) => {
  const { status } = req.body;
  const order = orderStore.updateStatus(req.params.id, status);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  return res.json({ success: true, data: order });
};

const updateOrderItemStatus = (req, res) => {
  const { status } = req.body;
  const result = orderStore.updateItemStatus(req.params.id, status);
  if (!result) return res.status(404).json({ success: false, message: 'Order item not found' });
  return res.json({ success: true, data: result });
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updateOrderItemStatus,
};
