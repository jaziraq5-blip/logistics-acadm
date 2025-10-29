// Load .env for local scripts
require('dotenv').config()
const { Pool } = require('pg')

async function test() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://logistics_user:logistics_password@localhost:5432/logistics_db'
  const pool = new Pool({ connectionString })
  try {
    console.log('Fetching services via direct query...')
    const res = await pool.query('SELECT * FROM services ORDER BY created_at DESC')
    console.log('Services fetched:', res.rowCount)
    console.dir(res.rows, { depth: 2 })
  } catch (err) {
    console.error('Error fetching services:', err)
  } finally {
    await pool.end()
  }
}

if (require.main === module) test()

module.exports = { test }
