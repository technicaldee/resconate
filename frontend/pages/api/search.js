const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { q, category = 'all', limit = 20 } = req.query;
        
        if (!q || q.length < 2) {
          return res.json({ success: true, results: [] });
        }

        const searchTerm = `%${q}%`;
        const results = [];

        // Search Employees
        if (category === 'all' || category === 'employees') {
          const empResult = await pool.query(
            `SELECT id, name, email, employee_id, department, position, 'employee' as type
             FROM employees
             WHERE name ILIKE $1 OR email ILIKE $1 OR employee_id ILIKE $1
             LIMIT $2`,
            [searchTerm, parseInt(limit)]
          );
          
          empResult.rows.forEach(row => {
            results.push({
              id: row.id,
              type: 'employee',
              title: row.name,
              subtitle: `${row.department || 'N/A'} • ${row.position || 'N/A'}`,
              meta: row.email,
              url: `/hr-dashboard?tab=employees&id=${row.id}`
            });
          });
        }

        // Search Jobs
        if (category === 'all' || category === 'jobs') {
          const jobResult = await pool.query(
            `SELECT id, title, department, location, 'job' as type
             FROM jobs
             WHERE title ILIKE $1 OR department ILIKE $1 OR location ILIKE $1
             LIMIT $2`,
            [searchTerm, parseInt(limit)]
          );
          
          jobResult.rows.forEach(row => {
            results.push({
              id: row.id,
              type: 'job',
              title: row.title,
              subtitle: `${row.department} • ${row.location}`,
              meta: `Job ID: ${row.id}`,
              url: `/hr-dashboard?tab=jobs&id=${row.id}`
            });
          });
        }

        // Search Candidates
        if (category === 'all' || category === 'candidates') {
          const candResult = await pool.query(
            `SELECT id, name, email, job_id, 'candidate' as type
             FROM candidates
             WHERE name ILIKE $1 OR email ILIKE $1
             LIMIT $2`,
            [searchTerm, parseInt(limit)]
          );
          
          candResult.rows.forEach(row => {
            results.push({
              id: row.id,
              type: 'candidate',
              title: row.name,
              subtitle: row.email,
              meta: `Candidate ID: ${row.id}`,
              url: `/hr-dashboard?tab=candidates&id=${row.id}`
            });
          });
        }

        // Search Documents
        if (category === 'all' || category === 'documents') {
          const docResult = await pool.query(
            `SELECT id, file_name, document_type, 'document' as type
             FROM documents
             WHERE file_name ILIKE $1 OR document_type ILIKE $1
             LIMIT $2`,
            [searchTerm, parseInt(limit)]
          );
          
          docResult.rows.forEach(row => {
            results.push({
              id: row.id,
              type: 'document',
              title: row.file_name,
              subtitle: row.document_type,
              meta: `Document ID: ${row.id}`,
              url: `/api/documents/${row.id}`
            });
          });
        }

        res.json({ success: true, results, query: q, category });
      } catch (e) {
        console.error('Error performing search:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

