const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://logistics_user:logistics_password@localhost:5432/logistics_db'

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function waitForDatabase(maxRetries = 30, delay = 2000) {
  console.log('Waiting for database to be ready...')
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect()
      await client.query('SELECT 1')
      client.release()
      console.log('✅ Database is ready!')
      return true
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${maxRetries}: Database not ready yet, waiting ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('Database failed to become ready after maximum retries')
}

async function initDatabase() {
  try {
    console.log('Initializing database...')
    
    // Wait for database to be ready
    await waitForDatabase()
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../lib/database/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    await pool.query(schema)
    console.log('✅ Database schema created successfully')
    
    // Test connection
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database connected:', result.rows[0].now)
    
    console.log('🎉 Database initialization completed!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
}

module.exports = { initDatabase }
