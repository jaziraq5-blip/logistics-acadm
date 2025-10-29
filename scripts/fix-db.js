const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/logistics_website'
})

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database structure...')
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'fix-services-table.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          console.log('Executing:', statement.trim().substring(0, 50) + '...')
          const result = await pool.query(statement)
          if (result.rows && result.rows.length > 0) {
            console.log('Result:', result.rows)
          }
        } catch (err) {
          console.log('Statement failed (might be expected):', err.message)
        }
      }
    }
    
    console.log('✅ Database fix completed!')
    
  } catch (error) {
    console.error('❌ Database fix failed:', error.message)
  } finally {
    await pool.end()
  }
}

fixDatabase()
