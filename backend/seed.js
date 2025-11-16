require('dotenv').config();
const { pool } = require('./database');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding database...');
    // Admin already seeded by initializeDatabase in typical start; ensure another one for testing
    const adminRes = await client.query('SELECT id FROM admins LIMIT 1');
    const adminId = adminRes.rows[0]?.id || null;

    // Seed employees
    await client.query(`
      INSERT INTO employees (employee_id, name, email, department, position, salary, start_date, status, benefits)
      VALUES 
      ('E-1001','Adaeze N','adaeze@example.com','Operations','COO', 850000.00, CURRENT_DATE - INTERVAL '365 days', 'active', '[]'::jsonb),
      ('E-1002','Derrick A','derrick@example.com','People','People Lead', 650000.00, CURRENT_DATE - INTERVAL '200 days', 'active', '[]'::jsonb)
      ON CONFLICT (employee_id) DO NOTHING;
    `);

    // Seed jobs
    await client.query(`
      INSERT INTO jobs (title, department, location, employment_type, description, requirements, benefits, status, posted_date, salary)
      VALUES
      ('Product Designer','Studio','Remote','full-time','Own product narratives','Figma, UX, systems','["Health","Remote"]','active', NOW(), 'N600,000'),
      ('HR Operations Manager','People','Lagos','full-time','Run HR ops','Payroll, compliance','["Pension","HMO"]','active', NOW(), 'N500,000')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Seeding complete.');
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  } finally {
    client.release();
  }
}

seed();


