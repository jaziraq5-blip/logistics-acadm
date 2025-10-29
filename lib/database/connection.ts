import { Pool } from 'pg'

// Build connection string from environment variables if DATABASE_URL is not provided.
// Default to localhost with the common Postgres port 5432 (many systems use 5432, not 5433).
function buildDefaultConnectionString() {
  const user = process.env.PGUSER || process.env.DB_USER || 'user'
  const password = process.env.PGPASSWORD || process.env.DB_PASSWORD || 'password'
  const host = process.env.PGHOST || process.env.DB_HOST || 'localhost'
  const port = process.env.PGPORT || process.env.DB_PORT || '5432'
  const database = process.env.PGDATABASE || process.env.DB_NAME || 'mydatabase'
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`
}

const connectionString = process.env.DATABASE_URL || buildDefaultConnectionString()

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  // Allow a slightly longer connection timeout to account for slow startups
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5000),
})

function parseHostPortFromConnection(connStr: string) {
  try {
    const url = new URL(connStr)
    return { host: url.hostname, port: url.port || '5432' }
  } catch (e) {
    return { host: 'localhost', port: '5432' }
  }
}

// Test database connection with clearer logging about target host/port
export async function testConnection() {
  const { host, port } = parseHostPortFromConnection(connectionString)
  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT NOW()')
      console.log('Database connected successfully to %s:%s - now=%o', host, port, result.rows[0])
      return true
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database connection failed to %s:%s - %o', host, port, error)
    return false
  }
}

// Execute query with error handling
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

// Get a client from the pool
export async function getClient() {
  return await pool.connect()
}

// Close all connections
export async function closePool() {
  await pool.end()
}

export { pool }
export default pool
