const { pool } = require('./database');

/**
 * Audit logging service for tracking user actions
 */
class AuditService {
  async log({
    userId,
    userType = 'admin',
    action,
    resourceType,
    resourceId,
    details = {},
    ipAddress,
    userAgent
  }) {
    try {
      await pool.query(
        `INSERT INTO audit_logs 
         (user_id, user_type, action, resource_type, resource_id, details, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          userType,
          action,
          resourceType,
          resourceId,
          JSON.stringify(details),
          ipAddress,
          userAgent
        ]
      );
      return { success: true };
    } catch (error) {
      console.error('Audit log error:', error);
      return { success: false, error: error.message };
    }
  }

  async getLogs({ userId, userType, resourceType, limit = 100, offset = 0 }) {
    try {
      let query = 'SELECT * FROM audit_logs WHERE 1=1';
      const params = [];
      let paramCount = 1;

      if (userId) {
        query += ` AND user_id = $${paramCount++}`;
        params.push(userId);
      }

      if (userType) {
        query += ` AND user_type = $${paramCount++}`;
        params.push(userType);
      }

      if (resourceType) {
        query += ` AND resource_type = $${paramCount++}`;
        params.push(resourceType);
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get audit logs error:', error);
      return { success: false, error: error.message };
    }
  }

  async getAuditReport({ startDate, endDate, action, resourceType }) {
    try {
      let query = `
        SELECT 
          action,
          resource_type,
          COUNT(*) as count,
          COUNT(DISTINCT user_id) as unique_users
        FROM audit_logs
        WHERE created_at >= $1 AND created_at <= $2
      `;
      const params = [startDate, endDate];
      let paramCount = 3;

      if (action) {
        query += ` AND action = $${paramCount++}`;
        params.push(action);
      }

      if (resourceType) {
        query += ` AND resource_type = $${paramCount++}`;
        params.push(resourceType);
      }

      query += ` GROUP BY action, resource_type ORDER BY count DESC`;

      const result = await pool.query(query, params);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Audit report error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new AuditService();

