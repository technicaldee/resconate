const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const importService = require('../../../lib/import');
const bcrypt = require('bcryptjs');

async function handler(req, res) {
  if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { csvData } = req.body;
        
        if (!csvData) {
          return res.status(400).json({ error: 'CSV data is required' });
        }

        const importResult = await importService.importEmployees(csvData, {
          skipDuplicates: true,
          validateEmail: true
        });

        if (!importResult.success) {
          return res.status(400).json({ error: importResult.error });
        }

        // Insert employees into database
        const inserted = [];
        const errors = [];

        for (const employee of importResult.data) {
          try {
            // Generate employee ID
            const employeeId = `EMP${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            
            // Generate password hash
            const passwordHash = await bcrypt.hash('TempPassword123!', 10);

            const result = await pool.query(
              `INSERT INTO employees 
               (employee_id, name, email, department, position, salary, phone, address, password_hash)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               RETURNING id, employee_id, name, email`,
              [
                employeeId,
                employee.name,
                employee.email,
                employee.department,
                employee.position,
                employee.salary,
                employee.phone,
                employee.address,
                passwordHash
              ]
            );

            inserted.push(result.rows[0]);
          } catch (error) {
            if (error.code === '23505') { // Unique violation
              errors.push({ email: employee.email, error: 'Email already exists' });
            } else {
              errors.push({ email: employee.email, error: error.message });
            }
          }
        }

        res.json({
          success: true,
          imported: inserted.length,
          errors: errors.length,
          errorDetails: errors,
          data: inserted
        });
      } catch (e) {
        console.error('Error importing employees:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

