require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function test() {
  try {
    console.log('Fetching team members...')
    const t = await pool.query('SELECT id, name_en, email FROM team_members ORDER BY sort_order, created_at')
    console.log('Team members:', t.rowCount)
    console.dir(t.rows, { depth: 2 })

    console.log('Fetching content pages...')
    const p = await pool.query('SELECT id, page_key, title_en FROM content_pages ORDER BY page_key')
    console.log('Content pages:', p.rowCount)
    console.dir(p.rows, { depth: 2 })

    console.log('Fetching settings...')
    const s = await pool.query('SELECT setting_key, setting_value FROM settings ORDER BY setting_key')
    console.log('Settings:', s.rowCount)
    console.dir(s.rows, { depth: 2 })
  } catch (err) {
    console.error('Error fetching:', err)
  } finally {
    await pool.end()
  }
}

if (require.main === module) test()

module.exports = { test }
