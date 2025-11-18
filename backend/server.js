const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
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
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

initializeDatabase();

// Security & performance
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin === '*' ? true : allowedOrigin,
  credentials: true
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'resconate-session',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// Serve frontend build
const frontendBuildDir = path.join(__dirname, '..', 'frontend', 'build');
const frontendPublicDir = path.join(__dirname, '..', 'frontend', 'public');
// Serve static files from build directory
app.use(express.static(frontendBuildDir));
app.use(express.static(frontendPublicDir));

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Resconate API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
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

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: Public demo projects
 *     responses:
 *       200: { description: OK }
 */
app.get('/api/projects', (req, res) => {
  res.json([
    { id: 1, name: 'Zocket AI', description: 'AI-powered marketing platform', image: 'https://placehold.co/600x400/111/333', category: 'Web App', color: 'blue', technologies: ['React','Node.js','TensorFlow'] },
    { id: 2, name: 'HeavyOps', description: 'Fleet management solution', image: 'https://placehold.co/600x400/111/333', category: 'Mobile App', color: 'orange', technologies: ['React Native','Firebase','Google Maps API'] }
  ]);
});

/**
 * @openapi
 * /api/testimonials:
 *   get:
 *     summary: Public testimonials
 *     responses:
 *       200: { description: OK }
 */
app.get('/api/testimonials', (req, res) => {
  res.json([
    { id: 1, text: 'Resconate moved us from idea to launch without breaking pace.', name: 'Adaeze N.', position: 'COO' },
    { id: 2, text: 'Payroll and compliance now feel automated; proactive team.', name: 'Derrick A.', position: 'People Lead' }
  ]);
});

// Fallback - serve React app for all non-API routes
app.get('*', (req, res, next) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }
  // Serve React app index.html for client-side routing
  const indexPath = path.join(frontendBuildDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found. Please run "npm run build" in the frontend directory.');
  }
});

const server = app.listen(PORT, () => console.log(`API running on ${PORT}. Docs at /api-docs`));
// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


