/**
 * API Tests
 */

const exportService = require('../lib/export');
const importService = require('../lib/import');
const securityService = require('../lib/security');

describe('Export Service', () => {
  test('converts array to CSV with headers', () => {
    const data = [
      { name: 'John', email: 'john@example.com' },
      { name: 'Jane', email: 'jane@example.com' }
    ];
    const csv = exportService.toCSV(data);
    
    expect(csv).toContain('name');
    expect(csv).toContain('email');
    expect(csv).toContain('John');
    expect(csv).toContain('Jane');
  });

  test('handles empty array', () => {
    const csv = exportService.toCSV([]);
    expect(csv).toBe('');
  });

  test('handles special characters in CSV', () => {
    const data = [{ name: 'John "Johnny" Doe', email: 'john@example.com' }];
    const csv = exportService.toCSV(data);
    expect(csv).toContain('"John ""Johnny"" Doe"');
  });
});

describe('Import Service', () => {
  test('parses CSV string correctly', () => {
    const csv = 'name,email\nJohn,john@example.com\nJane,jane@example.com';
    const result = importService.parseCSV(csv);
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('John');
  });

  test('validates email format', () => {
    expect(securityService.validateEmail('test@example.com')).toBe(true);
    expect(securityService.validateEmail('invalid-email')).toBe(false);
    expect(securityService.validateEmail('test@')).toBe(false);
  });

  test('validates password strength', () => {
    const weak = securityService.validatePassword('weak');
    expect(weak.valid).toBe(false);
    expect(weak.errors.length).toBeGreaterThan(0);

    const strong = securityService.validatePassword('StrongPass123!');
    expect(strong.valid).toBe(true);
    expect(strong.errors.length).toBe(0);
  });

  test('validates Nigerian phone number', () => {
    expect(securityService.validatePhone('08123456789')).toBe(true);
    expect(securityService.validatePhone('+2348123456789')).toBe(true);
    expect(securityService.validatePhone('123456789')).toBe(false);
  });
});

describe('Security Service', () => {
  test('sanitizes input to prevent XSS', () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = securityService.sanitizeInput(malicious);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });

  test('generates CSRF token', () => {
    const token = securityService.generateCSRFToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
  });
});

