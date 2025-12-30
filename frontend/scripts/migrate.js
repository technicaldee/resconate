/**
 * Database Migration Script
 * Run: node scripts/migrate.js
 */

const migrationService = require('../lib/migrations');

async function main() {
  const command = process.argv[2] || 'up';

  try {
    if (command === 'up' || command === 'migrate') {
      console.log('Running migrations...');
      const result = await migrationService.runMigrations();
      
      if (result.success) {
        console.log(`✅ Applied ${result.applied} migration(s)`);
        process.exit(0);
      } else {
        console.error('❌ Migration failed:', result.error);
        process.exit(1);
      }
    } else if (command === 'status') {
      const currentVersion = await migrationService.getCurrentVersion();
      const pending = await migrationService.getPendingMigrations();
      
      console.log(`Current version: ${currentVersion}`);
      console.log(`Pending migrations: ${pending.length}`);
      if (pending.length > 0) {
        console.log('Pending files:', pending.join(', '));
      }
    } else if (command === 'create') {
      const name = process.argv[3];
      if (!name) {
        console.error('Usage: node scripts/migrate.js create <migration_name>');
        process.exit(1);
      }
      
      const result = await migrationService.createMigration(name);
      console.log(`✅ Created migration: ${result.filename}`);
    } else {
      console.log('Usage:');
      console.log('  node scripts/migrate.js [up|status|create <name>]');
      process.exit(1);
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

main();
