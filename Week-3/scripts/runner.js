// ============================================================================
// Week 3: Database Engineering & SQL Mastery
// Database CLI Runner Script
// Author: Ashish (Internship Task)
//
// Usage:
//   npm run test-db       -> Test connection to Neon PostgreSQL
//   npm run setup         -> Create schema & insert seed data
//   npm run run-queries   -> Execute all 12 analytical queries and display results
//   node scripts/runner.js query 01 -> Run a specific query
// ============================================================================

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('❌ Error: DATABASE_URL is not set in .env file!');
    process.exit(1);
}

function getClient() {
    return new Client({
        connectionString: dbUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });
}

// 1. Test Connection
async function testConnection() {
    const client = getClient();
    try {
        console.log('🔄 Connecting to Neon PostgreSQL...');
        await client.connect();
        const res = await client.query('SELECT current_database() AS db, version() AS pg_version, NOW() AS server_time;');
        console.log('✅ Successfully connected to Neon Database!');
        console.log(`📦 Database: ${res.rows[0].db}`);
        console.log(`⏰ Server Time: ${res.rows[0].server_time}`);
        console.log(`ℹ️ Version: ${res.rows[0].pg_version.split(',')[0]}`);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    } finally {
        await client.end();
    }
}

// 2. Setup Schema & Seed Data
async function setupDatabase() {
    const client = getClient();
    try {
        await client.connect();
        console.log('🔄 Connected to database. Starting schema & seed setup...\n');

        // Step 1: Read and execute schema.sql
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        console.log('📄 Executing schema.sql (Creating tables, constraints, indexes)...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('✅ Schema created successfully!\n');

        // Step 2: Read and execute seed.sql
        const seedPath = path.join(__dirname, '..', 'seed.sql');
        console.log('🌱 Executing seed.sql (Populating sample categories, products, users, orders, payments, reviews)...');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log('✅ Seed data inserted successfully!\n');

        // Step 3: Verify row counts
        const tables = ['categories', 'users', 'products', 'orders', 'order_items', 'payments', 'reviews'];
        console.log('📊 Current Table Row Counts:');
        for (const tbl of tables) {
            const countRes = await client.query(`SELECT COUNT(*) FROM ${tbl}`);
            console.log(`   - ${tbl.padEnd(15)} : ${countRes.rows[0].count} rows`);
        }

        console.log('\n🎉 Setup completed successfully! You can now run the analytical queries.');
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
    } finally {
        await client.end();
    }
}

// 3. Run a single query by file name or prefix number
async function runSingleQuery(target) {
    const queriesDir = path.join(__dirname, '..', 'queries');
    const files = fs.readdirSync(queriesDir).filter(f => f.endsWith('.sql'));

    const matchedFile = files.find(f => f.toLowerCase().includes(target.toLowerCase()));
    if (!matchedFile) {
        console.error(`❌ Query file matching "${target}" not found in queries directory.`);
        console.log('Available query files:');
        files.forEach(f => console.log(`  - ${f}`));
        return;
    }

    const client = getClient();
    try {
        await client.connect();
        const filePath = path.join(queriesDir, matchedFile);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`\n========================================================================`);
        console.log(`🔍 Executing: ${matchedFile}`);
        console.log(`========================================================================`);

        const start = Date.now();
        const res = await client.query(sql);
        const duration = Date.now() - start;

        if (res.rows && res.rows.length > 0) {
            console.table(res.rows);
            console.log(`✅ Returned ${res.rows.length} rows in ${duration}ms\n`);
        } else {
            console.log(`ℹ️ Query completed with no rows returned (${duration}ms).\n`);
        }
    } catch (err) {
        console.error(`❌ Error running query ${matchedFile}:`, err.message);
    } finally {
        await client.end();
    }
}

// 4. Run all 12 queries
async function runAllQueries() {
    const queriesDir = path.join(__dirname, '..', 'queries');
    const files = fs.readdirSync(queriesDir).filter(f => f.endsWith('.sql')).sort();

    console.log(`\n========================================================================`);
    console.log(`🚀 Executing All ${files.length} Analytical SQL Queries Against Neon DB`);
    console.log(`========================================================================\n`);

    const client = getClient();
    try {
        await client.connect();

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i];
            const filePath = path.join(queriesDir, fileName);
            const sql = fs.readFileSync(filePath, 'utf8');

            console.log(`------------------------------------------------------------------------`);
            console.log(`[${i + 1}/${files.length}] ${fileName}`);
            console.log(`------------------------------------------------------------------------`);

            try {
                const start = Date.now();
                const res = await client.query(sql);
                const duration = Date.now() - start;

                if (res.rows && res.rows.length > 0) {
                    console.table(res.rows);
                    console.log(`Row count: ${res.rows.length} | Execution time: ${duration}ms\n`);
                } else {
                    console.log(`(No rows returned) | Execution time: ${duration}ms\n`);
                }
            } catch (queryErr) {
                console.error(`❌ Error executing ${fileName}:`, queryErr.message, '\n');
            }
        }

        console.log(`========================================================================`);
        console.log(`🎉 All ${files.length} queries executed successfully!`);
        console.log(`========================================================================\n`);
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
    } finally {
        await client.end();
    }
}

// Main execution switch
const command = process.argv[2] || 'run-all';
const arg = process.argv[3];

if (command === 'test') {
    testConnection();
} else if (command === 'setup' || command === 'reset') {
    setupDatabase();
} else if (command === 'query') {
    if (!arg) {
        console.log('Please specify a query number or file name. E.g: node scripts/runner.js query 01');
    } else {
        runSingleQuery(arg);
    }
} else if (command === 'run-all') {
    runAllQueries();
} else {
    console.log(`Unknown command: ${command}`);
    console.log('Available commands: test | setup | run-all | query <name>');
}
