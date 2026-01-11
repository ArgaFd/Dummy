const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const usersStore = require('../stores/usersStore');

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error('JWT_SECRET is required');
    err.statusCode = 500;
    err.expose = true;
    throw err;
  }

  return jwt.sign({ sub: userId }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = usersStore.getByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const user = await usersStore.create({ name, email, password, role });
  const token = signToken(user.id);

  return res.status(201).json({
    success: true,
    data: {
      token,
      user,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = usersStore.getByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = signToken(user.id);

  return res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    },
  });
};

const getMe = (req, res) => {
  return res.json({ success: true, data: req.user });
};

const getUsers = (req, res) => {
  return res.json({ success: true, data: { users: usersStore.getAll() } });
};

const updateUserRole = (req, res) => {
  const userId = Number(req.params.id);
  const { role } = req.body;

  const updated = usersStore.updateRole(userId, role);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, data: updated });
};

const deleteUser = (req, res) => {
  const userId = Number(req.params.id);
  const ok = usersStore.remove(userId);
  if (!ok) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, data: { deleted: true } });
};

module.exports = {
  register,
  login,
  getMe,
  getUsers,
  updateUserRole,
  deleteUser,
};
