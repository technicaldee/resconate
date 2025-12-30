/**
 * File upload service for handling document uploads
 * Supports local storage and cloud storage (AWS S3, Cloudinary)
 */

const { pool } = require('./database');
const fs = require('fs').promises;
const path = require('path');

class FileUploadService {
  constructor() {
    this.storageType = process.env.STORAGE_TYPE || 'local';
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB default
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
  }

  /**
   * Initialize upload directory
   */
  async initialize() {
    if (this.storageType === 'local') {
      try {
        await fs.mkdir(this.uploadDir, { recursive: true });
        await fs.mkdir(path.join(this.uploadDir, 'documents'), { recursive: true });
        await fs.mkdir(path.join(this.uploadDir, 'resumes'), { recursive: true });
        await fs.mkdir(path.join(this.uploadDir, 'photos'), { recursive: true });
      } catch (error) {
        console.error('Failed to create upload directories:', error);
      }
    }
  }

  /**
   * Validate file
   */
  validateFile(file) {
    const errors = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Upload file (local storage)
   */
  async uploadFile(file, options = {}) {
    const { employeeId, documentType = 'general', uploadedBy } = options;

    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    try {
      // Generate unique filename
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
      
      // Determine subdirectory based on document type
      let subdir = 'documents';
      if (documentType === 'resume') subdir = 'resumes';
      if (documentType === 'photo') subdir = 'photos';

      const filePath = path.join(this.uploadDir, subdir, filename);
      const relativePath = path.join(subdir, filename);

      // Save file
      await fs.writeFile(filePath, file.buffer);

      // Save to database
      const result = await pool.query(
        `INSERT INTO documents 
         (employee_id, document_type, file_name, file_path, file_size, mime_type, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          employeeId,
          documentType,
          file.originalname,
          relativePath,
          file.size,
          file.mimetype,
          uploadedBy
        ]
      );

      return {
        success: true,
        document: result.rows[0],
        url: `/uploads/${relativePath}`
      };
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload to cloud storage (AWS S3)
   */
  async uploadToS3(file, options = {}) {
    // AWS S3 integration would go here
    // const AWS = require('aws-sdk');
    // const s3 = new AWS.S3();
    // const uploadParams = { Bucket: process.env.S3_BUCKET, Key: key, Body: file.buffer };
    // const result = await s3.upload(uploadParams).promise();
    console.log('S3 upload not implemented');
    return { success: false, error: 'S3 upload not configured' };
  }

  /**
   * Upload to Cloudinary
   */
  async uploadToCloudinary(file, options = {}) {
    // Cloudinary integration would go here
    // const cloudinary = require('cloudinary').v2;
    // const result = await cloudinary.uploader.upload(file.path);
    console.log('Cloudinary upload not implemented');
    return { success: false, error: 'Cloudinary upload not configured' };
  }

  /**
   * Get document URL
   */
  getDocumentUrl(document) {
    if (this.storageType === 'local') {
      return `/uploads/${document.file_path}`;
    } else if (this.storageType === 's3') {
      return document.file_path; // S3 URL
    } else if (this.storageType === 'cloudinary') {
      return document.file_path; // Cloudinary URL
    }
    return null;
  }

  /**
   * Delete file
   */
  async deleteFile(documentId) {
    try {
      // Get document info
      const docResult = await pool.query('SELECT * FROM documents WHERE id = $1', [documentId]);
      if (docResult.rows.length === 0) {
        return { success: false, error: 'Document not found' };
      }

      const document = docResult.rows[0];

      // Delete file from storage
      if (this.storageType === 'local') {
        const filePath = path.join(this.uploadDir, document.file_path);
        await fs.unlink(filePath).catch(() => {
          // File might not exist, continue anyway
        });
      }

      // Delete from database
      await pool.query('DELETE FROM documents WHERE id = $1', [documentId]);

      return { success: true };
    } catch (error) {
      console.error('File deletion error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get employee documents
   */
  async getEmployeeDocuments(employeeId) {
    try {
      const result = await pool.query(
        'SELECT * FROM documents WHERE employee_id = $1 ORDER BY created_at DESC',
        [employeeId]
      );
      return { success: true, data: result.rows };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Initialize on module load
const fileUploadService = new FileUploadService();
if (typeof window === 'undefined') {
  fileUploadService.initialize();
}

// Export enhanced version if available, otherwise use basic
try {
  module.exports = require('./fileUploadEnhanced');
} catch (e) {
  module.exports = fileUploadService;
}

