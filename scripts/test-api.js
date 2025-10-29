(async () => {
  try {
    const base = 'http://localhost:3001'
    const urls = ['/api/check-services-table', '/api/services']
    for (const u of urls) {
      const res = await fetch(base + u, { method: 'GET' })
      console.log('\nRequest:', u, 'Status:', res.status)
      const j = await res.json()
      console.dir(j, { depth: 5 })
    }
  } catch (err) {
    console.error('API test error:', err.message || err)
    process.exit(1)
  }
})()
