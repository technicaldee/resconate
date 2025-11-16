const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { pool, initializeDatabase } = require('./database');
const { authenticateAdmin, loginAdmin } = require('./auth');
const { validateJob, createValidationMiddleware } = require('./validation');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

initializeDatabase();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'resconate-session',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// Serve frontend (kept connected)
const frontendDir = path.join(__dirname, '..', 'frontend');
const fallbackDir = path.join(__dirname, '..'); // fallback to project root if files remain there
app.use(express.static(frontendDir));
app.use(express.static(fallbackDir));

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Resconate API', version: '1.0.0' }
  },
  apis: [__filename] // using inline JSDoc in this file
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));

// Basic HR endpoints (Postgres-backed)
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 */
app.post('/api/auth/login', loginAdmin);

/**
 * @openapi
 * /api/hr/jobs:
 *   get:
 *     summary: List jobs
 *     responses:
 *       200:
 *         description: Jobs list
 *   post:
 *     summary: Create job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               department: { type: string }
 *               location: { type: string }
 *               employment_type: { type: string }
 *               salary: { type: string }
 *               description: { type: string }
 *               requirements: { type: string }
 *               benefits: { type: array, items: { type: string } }
 *     responses:
 *       200: { description: Created }
 */
app.get('/api/hr/jobs', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY posted_date DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/hr/jobs', authenticateAdmin, createValidationMiddleware(validateJob), async (req, res) => {
  try {
    const { title, department, location, employment_type, salary, description, requirements, benefits } = req.body;
    const result = await pool.query(
      'INSERT INTO jobs (title, department, location, employment_type, description, requirements, benefits, status, posted_date, salary) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [title, department, location, employment_type || null, description || null, requirements || null, JSON.stringify(benefits || []), 'active', new Date(), salary || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Frontend entry
app.get('/', (req, res) => {
  const file = fs.existsSync(path.join(frontendDir, 'index.html'))
    ? path.join(frontendDir, 'index.html')
    : path.join(fallbackDir, 'index.html');
  res.sendFile(file);
});

// Fallback
app.get('*', (req, res) => {
  const file = fs.existsSync(path.join(frontendDir, 'index.html'))
    ? path.join(frontendDir, 'index.html')
    : path.join(fallbackDir, 'index.html');
  res.sendFile(file);
});

app.listen(PORT, () => console.log(`API running on ${PORT}. Docs at /api-docs`));


