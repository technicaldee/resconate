/**
 * Import utilities for CSV and Excel parsing
 */

class ImportService {
  /**
   * Parse CSV string to array of objects
   */
  parseCSV(csvText, hasHeaders = true) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      return { success: false, error: 'Empty CSV file' };
    }

    // Parse headers
    const headers = hasHeaders 
      ? this.parseCSVLine(lines[0])
      : null;

    // Parse data rows
    const startIndex = hasHeaders ? 1 : 0;
    const data = lines.slice(startIndex).map((line, index) => {
      const values = this.parseCSVLine(line);
      if (hasHeaders && headers) {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header.trim()] = values[i] ? values[i].trim() : '';
        });
        return obj;
      }
      return values;
    });

    return { success: true, data, headers };
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of value
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    // Add last value
    values.push(current);
    return values;
  }

  /**
   * Import employees from CSV
   */
  async importEmployees(csvText, options = {}) {
    const { skipDuplicates = true, validateEmail = true } = options;
    const parseResult = this.parseCSV(csvText);

    if (!parseResult.success) {
      return parseResult;
    }

    const { data, headers } = parseResult;
    const errors = [];
    const imported = [];
    const skipped = [];

    // Validate headers
    const requiredHeaders = ['Name', 'Email', 'Department', 'Position'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return {
        success: false,
        error: `Missing required headers: ${missingHeaders.join(', ')}`
      };
    }

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // +2 because of header and 0-index

      // Validate required fields
      if (!row.Name || !row.Email) {
        errors.push({ row: rowNum, error: 'Missing required fields (Name or Email)' });
        continue;
      }

      // Validate email format
      if (validateEmail && !this.isValidEmail(row.Email)) {
        errors.push({ row: rowNum, error: 'Invalid email format' });
        continue;
      }

      // Check for duplicates
      if (skipDuplicates) {
        // This would check against database
        // For now, just add to imported
      }

      imported.push({
        name: row.Name,
        email: row.Email,
        department: row.Department || '',
        position: row.Position || '',
        salary: row.Salary ? parseFloat(row.Salary) : null,
        phone: row.Phone || '',
        address: row.Address || ''
      });
    }

    return {
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors,
      data: imported
    };
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Handle file upload and parse
   */
  async handleFileUpload(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const result = this.parseCSV(text);
          resolve(result);
        } catch (error) {
          reject({ success: false, error: error.message });
        }
      };

      reader.onerror = () => {
        reject({ success: false, error: 'Failed to read file' });
      };

      reader.readAsText(file);
    });
  }
}

module.exports = new ImportService();

