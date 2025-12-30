const securityService = require('../../../lib/security');

/**
 * Rate limiting middleware
 */
const rateLimitMiddleware = (req, res, next) => {
  securityService.rateLimit(req, res, next);
};

/**
 * Security headers middleware
 */
const securityHeadersMiddleware = (req, res, next) => {
  securityService.setSecurityHeaders(res);
  next();
};

/**
 * CSRF protection middleware
 */
const csrfProtectionMiddleware = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

/**
 * Input sanitization middleware
 */
const sanitizeInputMiddleware = (req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = securityService.sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  
  next();
};

module.exports = {
  rateLimitMiddleware,
  securityHeadersMiddleware,
  csrfProtectionMiddleware,
  sanitizeInputMiddleware
};

