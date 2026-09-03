/**
 * Database Migration Runner
 * Simple migration tool for running SQL migration files
 */

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'zoneiq_db',
    user: process.env.DB_USER || 'zoneiq_user',
    password: process.env.DB_PASSWORD,
});

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');
const MIGRATION_TABLE = 'schema_migrations';

/**
 * Create migration tracking table if it doesn't exist
 */
async function createMigrationTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    `;
    
    await pool.query(query);
    console.log(`✓ Migration tracking table '${MIGRATION_TABLE}' ready`);
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations() {
    const query = `SELECT filename FROM ${MIGRATION_TABLE} ORDER BY filename ASC`;
    const result = await pool.query(query);
    return result.rows.map(row => row.filename);
}

/**
 * Get list of available migration files
 */
async function getAvailableMigrations() {
    const files = await fs.readdir(MIGRATIONS_DIR);
    return files
        .filter(file => file.endsWith('.sql') && file !== 'README.md')
        .sort();
}

/**
 * Run a migration file
 */
async function runMigration(filename) {
    const filePath = path.join(MIGRATIONS_DIR, filename);
    const sql = await fs.readFile(filePath, 'utf8');
    
    // Extract only the UP migration part (before DOWN section)
    const upSection = sql.split(/-- DOWN Migration|-- ============================================================================\s*-- DOWN/i)[0];
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Execute migration SQL
        await client.query(upSection);
        
        // Record migration
        await client.query(
            `INSERT INTO ${MIGRATION_TABLE} (filename) VALUES ($1)`,
            [filename]
        );
        
        await client.query('COMMIT');
        console.log(`✓ Executed migration: ${filename}`);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Rollback a migration file
 */
async function rollbackMigration(filename) {
    const filePath = path.join(MIGRATIONS_DIR, filename);
    const sql = await fs.readFile(filePath, 'utf8');
    
    // Extract DOWN migration section
    const downMatch = sql.match(/-- DOWN Migration.*?-- (.*?)DROP/s);
    
    if (!downMatch) {
        console.warn(`⚠ No DOWN migration found in ${filename}`);
        console.warn('  Uncomment DROP statements to enable rollback');
        return;
    }
    
    // Extract DROP statements
    const dropStatements = sql
        .split(/-- DOWN Migration/i)[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-- DROP'))
        .map(line => line.replace(/^--\s*/, '').trim())
        .filter(line => line.length > 0);
    
    if (dropStatements.length === 0) {
        console.warn(`⚠ No DROP statements found in ${filename}`);
        console.warn('  Uncomment DROP statements in migration file to enable rollback');
        return;
    }
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Execute DROP statements
        for (const statement of dropStatements) {
            await client.query(statement);
        }
        
        // Remove migration record
        await client.query(
            `DELETE FROM ${MIGRATION_TABLE} WHERE filename = $1`,
            [filename]
        );
        
        await client.query('COMMIT');
        console.log(`✓ Rolled back migration: ${filename}`);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Run all pending migrations
 */
async function migrateUp() {
    console.log('Running migrations UP...\n');
    
    await createMigrationTable();
    
    const executed = await getExecutedMigrations();
    const available = await getAvailableMigrations();
    
    const pending = available.filter(file => !executed.includes(file));
    
    if (pending.length === 0) {
        console.log('✓ No pending migrations');
        return;
    }
    
    console.log(`Found ${pending.length} pending migration(s):\n`);
    
    for (const filename of pending) {
        try {
            await runMigration(filename);
        } catch (error) {
            console.error(`✗ Failed to execute migration: ${filename}`);
            console.error(error.message);
            process.exit(1);
        }
    }
    
    console.log('\n✓ All migrations executed successfully');
}

/**
 * Rollback the last executed migration
 */
async function migrateDown() {
    console.log('Rolling back last migration...\n');
    
    const executed = await getExecutedMigrations();
    
    if (executed.length === 0) {
        console.log('✓ No migrations to rollback');
        return;
    }
    
    const lastMigration = executed[executed.length - 1];
    
    try {
        await rollbackMigration(lastMigration);
        console.log('\n✓ Migration rolled back successfully');
    } catch (error) {
        console.error(`✗ Failed to rollback migration: ${lastMigration}`);
        console.error(error.message);
        process.exit(1);
    }
}

/**
 * Show migration status
 */
async function showStatus() {
    console.log('Migration Status:\n');
    
    await createMigrationTable();
    
    const executed = await getExecutedMigrations();
    const available = await getAvailableMigrations();
    
    console.log(`Total migration files: ${available.length}`);
    console.log(`Executed: ${executed.length}`);
    console.log(`Pending: ${available.length - executed.length}\n`);
    
    if (available.length === 0) {
        console.log('No migration files found');
        return;
    }
    
    console.log('Migrations:\n');
    
    for (const filename of available) {
        const isExecuted = executed.includes(filename);
        const status = isExecuted ? '✓ [EXECUTED]' : '  [PENDING] ';
        console.log(`${status} ${filename}`);
    }
}

/**
 * Main entry point
 */
async function main() {
    const command = process.argv[2];
    
    try {
        switch (command) {
            case 'up':
                await migrateUp();
                break;
            
            case 'down':
                await migrateDown();
                break;
            
            case 'status':
                await showStatus();
                break;
            
            default:
                console.log('Usage: node scripts/migrate.js <command>');
                console.log('');
                console.log('Commands:');
                console.log('  up      - Run all pending migrations');
                console.log('  down    - Rollback the last executed migration');
                console.log('  status  - Show migration status');
                process.exit(1);
        }
    } catch (error) {
        console.error('\n✗ Migration failed:');
        console.error(error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { migrateUp, migrateDown, showStatus };
