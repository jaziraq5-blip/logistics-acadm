const { Pool } = require('pg')

// Simple env loader: prefer process.env but fall back to .env.local or .env if present
function loadLocalEnv() {
  const fs = require('fs')
  const path = require('path')
  const candidates = ['.env.local', '.env']
  for (const fname of candidates) {
    const p = path.join(__dirname, '..', fname)
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8')
        const lines = content.split(/\r?\n/)
        for (const line of lines) {
          const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"#\n\r]+)"?/) // simple parser
          if (m) return m[1]
        }
      } catch (err) {
        // ignore and continue
      }
    }
  }
  return undefined
}

// Test database connection
async function testConnection() {
  console.log('🔍 Testing database connection...')

  const envConnection = process.env.DATABASE_URL || loadLocalEnv()
  const connectionString = envConnection || 'postgresql://logistics_user:logistics_password@localhost:5432/logistics_db'

  console.log('Connection string:', connectionString.replace(/:[^:]*@/, ':***@'))

  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })
  
  try {
    const client = await pool.connect()
    console.log('✅ Connected to database successfully!')
    
    // Test basic query
    const result = await client.query('SELECT version()')
    console.log('📊 PostgreSQL version:', result.rows[0].version)
    
    // Test database name
    const dbResult = await client.query('SELECT current_database()')
    console.log('🗄️  Current database:', dbResult.rows[0].current_database)
    
    // Test user
    const userResult = await client.query('SELECT current_user')
    console.log('👤 Current user:', userResult.rows[0].current_user)
    
    client.release()
    console.log('🎉 Database connection test passed!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Error details:', error)
  } finally {
    await pool.end()
  }
}

// Run if called directly
if (require.main === module) {
  testConnection()
}

module.exports = { testConnection }
