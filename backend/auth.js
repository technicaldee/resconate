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

const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.session?.token;
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, username, email, role FROM admins WHERE id=$1', [decoded.adminId]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid token' });
    res.json({ success: true, admin: result.rows[0] });
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const forgotPassword = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  try {
    const result = await pool.query('SELECT id, email FROM admins WHERE username=$1 OR email=$1', [username]);
    // For security, always return success even if user doesn't exist
    if (result.rows.length > 0) {
      // In production, send email with reset link here
      // For now, just return success
      console.log(`Password reset requested for: ${result.rows[0].email}`);
    }
    res.json({ success: true, message: 'If the username exists, password reset instructions have been sent.' });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Employee authentication
const authenticateEmployee = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.session?.employeeToken;
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, employee_id, name, email, department, position FROM employees WHERE id=$1', [decoded.employeeId]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid token' });
    req.employee = result.rows[0];
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const loginEmployee = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const result = await pool.query(
      'SELECT id, employee_id, name, email, password_hash, department, position FROM employees WHERE employee_id=$1 OR email=$1',
      [username]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const employee = result.rows[0];

    if (!employee.password_hash) {
      return res.status(401).json({ error: 'Account not set up. Please contact HR.' });
    }

    const ok = await bcrypt.compare(password, employee.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ employeeId: employee.id, employeeIdStr: employee.employee_id }, JWT_SECRET, { expiresIn: '24h' });
    req.session.employeeToken = token;
    req.session.employeeId = employee.id;

    res.json({
      success: true,
      token,
      employee: {
        id: employee.id,
        employee_id: employee.employee_id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position
      }
    });
  } catch (e) {
    console.error('Employee login error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEmployeeMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.session?.employeeToken;
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      'SELECT id, employee_id, name, email, department, position, salary, start_date, status FROM employees WHERE id=$1',
      [decoded.employeeId]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid token' });
    res.json({ success: true, employee: result.rows[0] });
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Earner authentication
const authenticateEarner = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.session?.earnerToken;
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check public_earners first
    let earner = await prisma.public_earners.findUnique({
      where: { id: decoded.earnerId }
    });

    if (!earner) {
      // Check if it's an employee logged in as earner
      const employee = await prisma.employees.findUnique({
        where: { id: decoded.earnerId }
      });
      if (employee && employee.is_earner) {
        earner = employee;
      }
    }

    if (!earner) return res.status(401).json({ error: 'Invalid token' });
    req.earner = earner;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const registerPublicEarner = async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await prisma.public_earners.findFirst({
      where: { OR: [{ email }, { phone }] }
    });
    if (existing) return res.status(400).json({ error: 'Email or phone already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const earner = await prisma.public_earners.create({
      data: {
        full_name,
        email,
        phone,
        password_hash,
        is_verified: false // Requires NIN verification later
      }
    });

    // Automatically create wallet
    await prisma.wallets.create({
      data: {
        owner_id: earner.id,
        owner_type: 'PUBLIC_EARNER',
        available_balance: 0,
        pending_balance: 0
      }
    });

    const token = jwt.sign({ earnerId: earner.id, type: 'public' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, earner: { id: earner.id, full_name, email } });
  } catch (e) {
    console.error('Earner registration error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginPublicEarner = async (req, res) => {
  const { username, password } = req.body; // username can be email or phone
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const earner = await prisma.public_earners.findFirst({
      where: { OR: [{ email: username }, { phone: username }] }
    });

    if (!earner) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, earner.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ earnerId: earner.id, type: 'public' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      earner: { id: earner.id, full_name: earner.full_name, email: earner.email, is_verified: earner.is_verified }
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEarnerMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.session?.earnerToken;
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);

    const earner = await prisma.public_earners.findUnique({
      where: { id: decoded.earnerId },
      select: { id: true, full_name: true, email: true, phone: true, is_verified: true, created_at: true }
    });

    if (!earner) return res.status(401).json({ error: 'Invalid token' });
    res.json({ success: true, earner });
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  authenticateAdmin,
  loginAdmin,
  getMe,
  forgotPassword,
  authenticateEmployee,
  loginEmployee,
  getEmployeeMe,
  authenticateEarner,
  registerPublicEarner,
  loginPublicEarner,
  getEarnerMe
};


