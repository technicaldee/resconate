const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'postgres',
        password: process.env.DB_PASSWORD || 'Test1234',
        port: process.env.DB_PORT || 5432,
      }
);

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        department VARCHAR(100),
        position VARCHAR(100),
        salary DECIMAL(12,2),
        start_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        benefits JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        employment_type VARCHAR(50),
        description TEXT,
        requirements TEXT,
        benefits JSONB DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'active',
        posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables ensured');
  } finally {
    client.release();
  }
};

const createDefaultAdmin = async () => {
  const bcrypt = require('bcryptjs');
  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT id FROM admins WHERE username=$1', ['admin']);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO admins (username, email, password_hash, role) VALUES ($1,$2,$3,$4)',
        ['admin', 'admin@resconate.local', hash, 'super_admin']
      );
      console.log('Seeded default admin (admin/admin123)');
    }
  } finally {
    client.release();
  }
};

const initializeDatabase = async () => {
  await createTables();
  await createDefaultAdmin();
};

module.exports = { pool, initializeDatabase };


