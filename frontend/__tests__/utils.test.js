/**
 * Basic utility tests
 * Run with: npm test
 */

const exportService = require('../lib/export');
const importService = require('../lib/import');
const securityService = require('../lib/security');

describe('Export Service', () => {
  test('should convert array to CSV', () => {
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

  test('should handle empty array', () => {
    const csv = exportService.toCSV([]);
    expect(csv).toBe('');
  });
});

describe('Import Service', () => {
  test('should parse CSV string', () => {
    const csv = 'name,email\nJohn,john@example.com\nJane,jane@example.com';
    const result = importService.parseCSV(csv);
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('John');
  });

  test('should validate email format', () => {
    expect(securityService.validateEmail('test@example.com')).toBe(true);
    expect(securityService.validateEmail('invalid-email')).toBe(false);
  });

  test('should validate password strength', () => {
    const weak = securityService.validatePassword('weak');
    expect(weak.valid).toBe(false);

    const strong = securityService.validatePassword('StrongPass123!');
    expect(strong.valid).toBe(true);
  });
});

