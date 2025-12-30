const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');
const fileUploadService = require('../../lib/fileUpload');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { employeeId, documentType } = req.query;
        let query = 'SELECT * FROM documents WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (employeeId) {
          query += ` AND employee_id = $${paramCount++}`;
          params.push(parseInt(employeeId));
        }

        if (documentType) {
          query += ` AND document_type = $${paramCount++}`;
          params.push(documentType);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching documents:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      upload.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: 'File upload error: ' + err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
          const { employee_id, document_type = 'general' } = req.body;
          
          const file = {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            buffer: req.file.buffer
          };

          const uploadResult = await fileUploadService.uploadFile(file, {
            employeeId: employee_id ? parseInt(employee_id) : null,
            documentType: document_type,
            uploadedBy: req.admin.id
          });

          if (uploadResult.success) {
            res.json({ success: true, data: uploadResult.document });
          } else {
            res.status(400).json({ error: uploadResult.error || 'Upload failed' });
          }
        } catch (e) {
          console.error('Error uploading document:', e);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    });
  } else if (req.method === 'DELETE') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'id is required' });
        }

        const deleteResult = await fileUploadService.deleteFile(parseInt(id));
        
        if (deleteResult.success) {
          res.json({ success: true });
        } else {
          res.status(400).json({ error: deleteResult.error });
        }
      } catch (e) {
        console.error('Error deleting document:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

