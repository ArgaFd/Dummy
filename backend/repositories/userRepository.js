const { getPool } = require('../db/postgres');

const toUser = (row) => {
  if (!row) return null;
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash,
  };
};

const findByEmail = async (email) => {
  const pool = getPool();
  const { rows } = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1', [
    String(email).toLowerCase(),
  ]);
  return toUser(rows[0]);
};

const findById = async (id) => {
  const pool = getPool();
  const { rows } = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE id = $1', [Number(id)]);
  return toUser(rows[0]);
};

const createUser = async ({ name, email, passwordHash, role }) => {
  const pool = getPool();
  const { rows } = await pool.query(
    'INSERT INTO users(name, email, password_hash, role) VALUES($1,$2,$3,$4) RETURNING id, name, email, role, password_hash',
    [String(name), String(email).toLowerCase(), String(passwordHash), String(role)]
  );
  return toUser(rows[0]);
};

const getAll = async () => {
  const pool = getPool();
  const { rows } = await pool.query('SELECT id, name, email, role FROM users ORDER BY id ASC');
  return rows.map((r) => ({ id: Number(r.id), name: r.name, email: r.email, role: r.role }));
};

const ownerExists = async () => {
  const pool = getPool();
  const { rows } = await pool.query("SELECT 1 FROM users WHERE role = 'owner' LIMIT 1");
  return rows.length > 0;
};

const updateRole = async (id, role) => {
  const pool = getPool();
  const { rows } = await pool.query('UPDATE users SET role = $2 WHERE id = $1 RETURNING id, name, email, role', [
    Number(id),
    String(role),
  ]);
  const r = rows[0];
  if (!r) return null;
  return { id: Number(r.id), name: r.name, email: r.email, role: r.role };
};

const remove = async (id) => {
  const pool = getPool();
  const result = await pool.query('DELETE FROM users WHERE id = $1', [Number(id)]);
  return result.rowCount > 0;
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  getAll,
  ownerExists,
  updateRole,
  remove,
};
