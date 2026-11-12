// ==============================================================================
// DATABASE CONFIGURATION (PostgreSQL / Neon DB)
// ==============================================================================
// Is file me hum PostgreSQL database connection set up kar rahe hain.
// Hum 'pg' (node-postgres) library ka 'Pool' use kar rahe hain.
// Pool multiple requests ke liye database connections ko reuse karta hai,
// jisse application fast aur scalable banti hai.
// ==============================================================================

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// 1. Check karna ki DATABASE_URL .env me maujood hai ya nahi
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl.includes('username:password@ep-your-database-id')) {
  console.warn('\n⚠️  WARNING: DATABASE_URL .env file me default/dummy set hai!');
  console.warn('👉 Kripya `.env` file open karein aur apna Neon PostgreSQL connection string paste karein.\n');
}

// 2. PostgreSQL Connection Pool create karna
// Neon DB cloud database hai isliye SSL connection compulsory hota hai (`ssl: { rejectUnauthorized: false }`)
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false, // Neon cloud SSL certificates ke liye zaroori hai
  },
  max: 10, // Ek time par maximum 10 idle connections allow karega
  idleTimeoutMillis: 30000, // 30 seconds idle rehne par connection close hoga
  connectionTimeoutMillis: 10000, // 10 seconds me connection nahi bana toh timeout error aayega
});

// Event listener: Jab bhi naya client connect hoga
pool.on('connect', () => {
  // connection banne par pool internally log rakhta hai
});

// Event listener: Agar pool me koi unexpected error aaye
pool.on('error', (err) => {
  console.error('❌ Unexpected database error on idle client:', err.message);
});

// 3. Database & Table Initialization Function
// Is function se hum check karte hain ki database connect ho raha hai ya nahi,
// aur agar 'todos' table exist nahi karti toh automatically table create kar dete hain.
const initDB = async () => {
  try {
    console.log('🔄 Connecting to Neon PostgreSQL...');
    
    // Quick test query - database name aur server time check karte hain
    const connectionTest = await pool.query('SELECT current_database() AS db_name, NOW() AS server_time;');
    console.log(`✅ Database Connected: "${connectionTest.rows[0].db_name}"`);
    console.log(`⏰ Server Timestamp: ${connectionTest.rows[0].server_time}`);

    // Table Auto-Creation Query:
    // id: Auto-increment primary key (SERIAL)
    // title: Todo ka task name (NOT NULL means empty nahi ho sakta)
    // description: Optional detail ya notes (TEXT)
    // is_completed: Status flag (default false)
    // created_at: Jab todo banaya gaya
    // updated_at: Jab todo modify kiya gaya
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log('✅ Table "todos" verified/created successfully!');
    return true;
  } catch (error) {
    console.error('\n❌ Database Connection Failed:');
    console.error(`   Message: ${error.message}`);
    console.error('\n👉 Tips to resolve:');
    console.error('   1. Check if `.env` file exists in Week-6 directory.');
    console.error('   2. Verify DATABASE_URL format (should start with postgresql://...).');
    console.error('   3. Ensure Neon database is not paused/suspended.');
    return false;
  }
};

// 4. Standalone Test: Agar is file ko directly run kiya jaye (`node config/db.js`)
if (require.main === module) {
  initDB().then(() => {
    console.log('🏁 Database check completed.');
    process.exit(0);
  });
}

// Module exports taaki hum ise server.js aur controllers me use kar sakein
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB,
};

