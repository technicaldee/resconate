/**
 * Enhanced File Upload Service with Cloud Storage Support
 * Supports local storage, AWS S3, and Cloudinary
 */

const { pool } = require('./database');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileUploadServiceEnhanced {
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

    // Cloud storage configuration
    this.s3Config = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.S3_BUCKET
    };

    this.cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    };
  }

  /**
   * Initialize upload directory and cloud storage
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

    // Initialize cloud storage clients if configured
    if (this.storageType === 's3' && this.s3Config.accessKeyId) {
      this.s3Client = await this.initS3();
    }

    if (this.storageType === 'cloudinary' && this.cloudinaryConfig.cloud_name) {
      this.cloudinaryClient = await this.initCloudinary();
    }
  }

  /**
   * Initialize AWS S3 client
   */
  async initS3() {
    try {
      const AWS = require('aws-sdk');
      return new AWS.S3({
        accessKeyId: this.s3Config.accessKeyId,
        secretAccessKey: this.s3Config.secretAccessKey,
        region: this.s3Config.region
      });
    } catch (error) {
      console.error('S3 initialization error:', error);
      return null;
    }
  }

  /**
   * Initialize Cloudinary client
   */
  async initCloudinary() {
    try {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config(this.cloudinaryConfig);
      return cloudinary;
    } catch (error) {
      console.error('Cloudinary initialization error:', error);
      return null;
    }
  }

  /**
   * Validate file
   */
  validateFile(file) {
    const errors = [];

    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Upload file to appropriate storage
   */
  async uploadFile(file, options = {}) {
    const { employeeId, documentType = 'general', uploadedBy } = options;

    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    try {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
      
      let filePath;
      let fileUrl;

      if (this.storageType === 's3' && this.s3Client) {
        const result = await this.uploadToS3(file, filename, documentType);
        filePath = result.key;
        fileUrl = result.url;
      } else if (this.storageType === 'cloudinary' && this.cloudinaryClient) {
        const result = await this.uploadToCloudinary(file, filename, documentType);
        filePath = result.public_id;
        fileUrl = result.url;
      } else {
        // Local storage
        const subdir = this.getSubdirectory(documentType);
        const localPath = path.join(this.uploadDir, subdir, filename);
        await fs.writeFile(localPath, file.buffer);
        filePath = path.join(subdir, filename);
        fileUrl = `/uploads/${filePath}`;
      }

      // Save to database
      const result = await pool.query(
        `INSERT INTO documents 
         (employee_id, document_type, file_name, file_path, file_size, mime_type, uploaded_by, storage_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          employeeId,
          documentType,
          file.originalname,
          filePath,
          file.size,
          file.mimetype,
          uploadedBy,
          this.storageType
        ]
      );

      return {
        success: true,
        document: result.rows[0],
        url: fileUrl
      };
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload to AWS S3
   */
  async uploadToS3(file, filename, documentType) {
    const key = `${documentType}/${Date.now()}_${filename}`;
    
    const params = {
      Bucket: this.s3Config.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private', // Make files private by default
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString()
      }
    };

    await this.s3Client.putObject(params).promise();
    
    const url = this.s3Client.getSignedUrl('getObject', {
      Bucket: this.s3Config.bucket,
      Key: key,
      Expires: 3600 // 1 hour
    });

    return { key, url };
  }

  /**
   * Upload to Cloudinary
   */
  async uploadToCloudinary(file, filename, documentType) {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: `resconate/${documentType}`,
        resource_type: 'auto',
        public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension
        overwrite: false
      };

      this.cloudinaryClient.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });
  }

  /**
   * Get document URL (with signed URL for S3)
   */
  async getDocumentUrl(document) {
    if (this.storageType === 'local') {
      return `/uploads/${document.file_path}`;
    } else if (this.storageType === 's3' && this.s3Client) {
      // Generate signed URL
      return this.s3Client.getSignedUrl('getObject', {
        Bucket: this.s3Config.bucket,
        Key: document.file_path,
        Expires: 3600
      });
    } else if (this.storageType === 'cloudinary') {
      return document.file_path; // Cloudinary URL is already public
    }
    return null;
  }

  /**
   * Delete file from storage
   */
  async deleteFile(documentId) {
    try {
      const docResult = await pool.query('SELECT * FROM documents WHERE id = $1', [documentId]);
      if (docResult.rows.length === 0) {
        return { success: false, error: 'Document not found' };
      }

      const document = docResult.rows[0];

      // Delete from storage
      if (this.storageType === 's3' && this.s3Client) {
        await this.s3Client.deleteObject({
          Bucket: this.s3Config.bucket,
          Key: document.file_path
        }).promise();
      } else if (this.storageType === 'cloudinary' && this.cloudinaryClient) {
        await this.cloudinaryClient.uploader.destroy(document.file_path);
      } else {
        // Local storage
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
   * Get subdirectory based on document type
   */
  getSubdirectory(documentType) {
    if (documentType === 'resume') return 'resumes';
    if (documentType === 'photo') return 'photos';
    return 'documents';
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
      
      // Generate URLs for each document
      const documentsWithUrls = await Promise.all(
        result.rows.map(async (doc) => {
          const url = await this.getDocumentUrl(doc);
          return { ...doc, url };
        })
      );

      return { success: true, data: documentsWithUrls };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create file version (for versioning support)
   */
  async createVersion(documentId, newFile) {
    try {
      const originalDoc = await pool.query('SELECT * FROM documents WHERE id = $1', [documentId]);
      if (originalDoc.rows.length === 0) {
        return { success: false, error: 'Document not found' };
      }

      const original = originalDoc.rows[0];
      const version = (original.version || 0) + 1;

      // Upload new version
      const uploadResult = await this.uploadFile(newFile, {
        employeeId: original.employee_id,
        documentType: original.document_type,
        uploadedBy: original.uploaded_by
      });

      if (uploadResult.success) {
        // Update version number
        await pool.query(
          'UPDATE documents SET version = $1, previous_version_id = $2 WHERE id = $3',
          [version, documentId, uploadResult.document.id]
        );
      }

      return uploadResult;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Initialize on module load
const fileUploadServiceEnhanced = new FileUploadServiceEnhanced();
if (typeof window === 'undefined') {
  fileUploadServiceEnhanced.initialize();
}

module.exports = fileUploadServiceEnhanced;

