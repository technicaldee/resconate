/**
 * Database Migration System
 * Handles database schema versioning and migrations
 */

const { pool } = require('./database');
const fs = require('fs').promises;
const path = require('path');

class MigrationService {
  constructor() {
    this.migrationsDir = path.join(__dirname, '../migrations');
    this.versionTable = 'schema_migrations';
  }

  /**
   * Initialize migration system
   */
  async initialize() {
    const client = await pool.connect();
    try {
      // Create migrations table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.versionTable} (
          version INTEGER PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Migration system initialized');
    } finally {
      client.release();
    }
  }

  /**
   * Get current database version
   */
  async getCurrentVersion() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT MAX(version) as version FROM ${this.versionTable}`
      );
      return result.rows[0]?.version || 0;
    } finally {
      client.release();
    }
  }

  /**
   * Get all applied migrations
   */
  async getAppliedMigrations() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM ${this.versionTable} ORDER BY version ASC`
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Get pending migrations
   */
  async getPendingMigrations() {
    await this.ensureMigrationsDir();
    const files = await fs.readdir(this.migrationsDir);
    const migrationFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort();

    const applied = await this.getAppliedMigrations();
    const appliedVersions = new Set(applied.map(m => m.version));

    return migrationFiles.filter(file => {
      const version = parseInt(file.split('_')[0]);
      return !appliedVersions.has(version);
    });
  }

  /**
   * Ensure migrations directory exists
   */
  async ensureMigrationsDir() {
    try {
      await fs.mkdir(this.migrationsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  /**
   * Run a single migration
   */
  async runMigration(filename) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const filePath = path.join(this.migrationsDir, filename);
      const sql = await fs.readFile(filePath, 'utf8');
      
      // Execute migration SQL
      await client.query(sql);

      // Record migration
      const version = parseInt(filename.split('_')[0]);
      const name = filename.replace(/^\d+_/, '').replace(/\.sql$/, '');
      
      await client.query(
        `INSERT INTO ${this.versionTable} (version, name) VALUES ($1, $2)`,
        [version, name]
      );

      await client.query('COMMIT');
      console.log(`Migration ${filename} applied successfully`);
      
      return { success: true, version, name };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Migration ${filename} failed:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Run all pending migrations
   */
  async runMigrations() {
    await this.initialize();
    const pending = await this.getPendingMigrations();
    
    if (pending.length === 0) {
      console.log('No pending migrations');
      return { success: true, applied: 0 };
    }

    console.log(`Found ${pending.length} pending migration(s)`);
    const applied = [];

    for (const file of pending) {
      try {
        const result = await this.runMigration(file);
        applied.push(result);
      } catch (error) {
        console.error(`Failed to apply migration ${file}:`, error);
        return { success: false, error: error.message, applied };
      }
    }

    return { success: true, applied: applied.length, migrations: applied };
  }

  /**
   * Rollback last migration
   */
  async rollback() {
    const client = await pool.connect();
    try {
      // Get last applied migration
      const result = await client.query(
        `SELECT * FROM ${this.versionTable} ORDER BY version DESC LIMIT 1`
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'No migrations to rollback' };
      }

      const migration = result.rows[0];
      // Note: Rollback would require down migration files
      // For now, just remove the migration record
      // In production, you'd have a down migration file

      console.log(`Rollback not fully implemented - would rollback version ${migration.version}`);
      return { success: false, error: 'Rollback requires down migration files' };
    } finally {
      client.release();
    }
  }

  /**
   * Create a new migration file
   */
  async createMigration(name) {
    await this.ensureMigrationsDir();
    
    const currentVersion = await this.getCurrentVersion();
    const nextVersion = currentVersion + 1;
    const timestamp = Date.now();
    const filename = `${String(nextVersion).padStart(4, '0')}_${name}_${timestamp}.sql`;
    const filePath = path.join(this.migrationsDir, filename);

    const template = `-- Migration: ${name}
-- Version: ${nextVersion}
-- Created: ${new Date().toISOString()}

-- Add your migration SQL here
-- Example:
-- ALTER TABLE employees ADD COLUMN new_field VARCHAR(255);
`;

    await fs.writeFile(filePath, template);
    console.log(`Created migration file: ${filename}`);
    return { success: true, filename, path: filePath };
  }
}

module.exports = new MigrationService();

