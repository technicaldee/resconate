/**
 * Security utilities for rate limiting, input validation, etc.
 */

class SecurityService {
  constructor() {
    this.rateLimitStore = new Map();
    this.rateLimitWindow = 15 * 60 * 1000; // 15 minutes
    this.maxRequests = 100;
  }

  /**
   * Rate limiting middleware
   */
  rateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!this.rateLimitStore.has(ip)) {
      this.rateLimitStore.set(ip, { count: 1, resetTime: now + this.rateLimitWindow });
      return next();
    }

    const limit = this.rateLimitStore.get(ip);
    
    if (now > limit.resetTime) {
      limit.count = 1;
      limit.resetTime = now + this.rateLimitWindow;
      return next();
    }

    if (limit.count >= this.maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.'
      });
    }

    limit.count++;
    next();
  }

  /**
   * Sanitize input to prevent XSS
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number (Nigerian format)
   */
  validatePhone(phone) {
    const phoneRegex = /^(\+234|0)?[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validate password strength
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      errors: [
        password.length < minLength && 'Password must be at least 8 characters',
        !hasUpperCase && 'Password must contain an uppercase letter',
        !hasLowerCase && 'Password must contain a lowercase letter',
        !hasNumber && 'Password must contain a number',
        !hasSpecialChar && 'Password must contain a special character'
      ].filter(Boolean)
    };
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  /**
   * Set security headers
   */
  setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
  }
}

module.exports = new SecurityService();

