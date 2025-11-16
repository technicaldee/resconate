const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'resconate-secret';

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.session?.token;
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, username, email, role FROM admins WHERE id=$1', [decoded.adminId]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid token' });
    req.admin = result.rows[0];
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const result = await pool.query('SELECT id, username, email, password_hash, role FROM admins WHERE username=$1 OR email=$1', [username]);
  if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
  const admin = result.rows[0];
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });
  req.session.token = token;
  req.session.adminId = admin.id;
  res.json({ success: true, token, admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
};

module.exports = { authenticateAdmin, loginAdmin };


