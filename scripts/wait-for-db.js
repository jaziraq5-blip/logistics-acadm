const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function waitForDatabase() {
  console.log('🔍 Checking database connection...')
  
  const maxRetries = 30
  const delay = 2000
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect()
      await client.query('SELECT 1')
      client.release()
      console.log('✅ Database is ready and accepting connections!')
      return true
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${maxRetries}: Database not ready yet...`)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  console.error('❌ Database failed to become ready after maximum retries')
  process.exit(1)
}

// Run if called directly
if (require.main === module) {
  waitForDatabase()
    .then(() => {
      console.log('🎉 Database is ready!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
    .finally(() => {
      pool.end()
    })
}

module.exports = { waitForDatabase }
