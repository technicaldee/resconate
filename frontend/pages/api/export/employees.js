const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const exportService = require('../../../lib/export');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const result = await pool.query(
          'SELECT employee_id, name, email, department, position, salary, phone, status, start_date FROM employees ORDER BY created_at DESC'
        );

        const csv = exportService.toCSV(result.rows, [
          'employee_id', 'name', 'email', 'department', 'position', 'salary', 'phone', 'status', 'start_date'
        ]);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=employees_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
      } catch (e) {
        console.error('Error exporting employees:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

