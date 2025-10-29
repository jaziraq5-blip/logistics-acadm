const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Read SQL file
const sqlFile = path.join(__dirname, 'update-image-paths.sql')
const sqlQuery = fs.readFileSync(sqlFile, 'utf8')

async function updateImagePaths() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://logistics_user:logistics_password@localhost:5432/logistics_db'
  
  const pool = new Pool({ connectionString })
  
  try {
    console.log('🔄 Updating image paths in database...')
    const result = await pool.query(sqlQuery)
    console.log('✅ Successfully updated image paths')
    console.log('Updated services:', result[2].rows)
  } catch (error) {
    console.error('❌ Error updating image paths:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

updateImagePaths()