const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/logistics_website'
})

async function runMigration() {
  try {
    console.log('🔄 Running database migration...')
    
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrate-services-table.sql'), 'utf8')
    
    // Execute the migration
    await pool.query(migrationSQL)
    
    console.log('✅ Migration completed successfully!')
    
    // Verify the changes
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    console.log('📋 Services table structure:')
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`)
    })
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
  } finally {
    await pool.end()
  }
}

runMigration()
