import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET() {
  try {
    console.log('🔍 Checking database structure...')
    
    // Check what columns actually exist in services table
    const columns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    console.log('Current columns:', columns.rows)
    
    // Check if we have any services
    const servicesCount = await query('SELECT COUNT(*) as count FROM services')
    
    // Try to get a sample service to see the actual data structure
    let sampleService = null
    try {
      const result = await query('SELECT * FROM services LIMIT 1')
      sampleService = result.rows[0]
      console.log('Sample service:', sampleService)
    } catch (err) {
      console.log('No services found or error:', err)
    }
    
    // Check what the code expects vs what exists
    const expectedColumns = ['name_en', 'name_ar', 'name_ro', 'description_en', 'description_ar', 'description_ro', 'icon', 'image_url']
    const actualColumns = columns.rows.map((col: any) => col.column_name)
    
    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col))
    const wrongColumns = actualColumns.filter((col: string) => col.startsWith('title_'))
    
    console.log('Missing columns:', missingColumns)
    console.log('Wrong columns:', wrongColumns)
    
    return NextResponse.json({
      success: true,
      columns: columns.rows,
      servicesCount: servicesCount.rows[0].count,
      sampleService: sampleService,
      expectedColumns: expectedColumns,
      actualColumns: actualColumns,
      missingColumns: missingColumns,
      wrongColumns: wrongColumns,
      needsFix: missingColumns.length > 0 || wrongColumns.length > 0
    })
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
