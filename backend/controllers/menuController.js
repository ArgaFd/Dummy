const menuStore = require('../stores/menuStore');

const normalizeMenuPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;

  if (payload.isAvailable !== undefined && payload.is_available === undefined) {
    return { ...payload, is_available: payload.isAvailable };
  }

  return payload;
};

const getMenuItems = (req, res) => {
  return res.json({ success: true, data: { items: menuStore.getAll() } });
};

const getMenuItem = (req, res) => {
  const item = menuStore.getById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
  return res.json({ success: true, data: item });
};

const createMenuItem = (req, res) => {
  const item = menuStore.create(normalizeMenuPayload(req.body));
  return res.status(201).json({ success: true, data: item });
};

const updateMenuItem = (req, res) => {
  const item = menuStore.update(req.params.id, normalizeMenuPayload(req.body));
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
  return res.json({ success: true, data: item });
};

const deleteMenuItem = (req, res) => {
  const ok = menuStore.remove(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Menu item not found' });
  return res.json({ success: true, data: { deleted: true } });
};

const getMenuCategories = (req, res) => {
  return res.json({ success: true, data: menuStore.getCategories() });
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuCategories,
};
