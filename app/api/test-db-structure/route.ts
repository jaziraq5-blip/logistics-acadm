import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET() {
  try {
    // Check services table structure
    const result = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    // Check if we have any services
    const servicesCount = await query('SELECT COUNT(*) as count FROM services')
    
    // Try to get a sample service to see what columns exist
    let sampleService = null
    try {
      const sampleResult = await query('SELECT * FROM services LIMIT 1')
      sampleService = sampleResult.rows[0]
    } catch (err) {
      console.log('No services found or table structure issue')
    }
    
    return NextResponse.json({
      success: true,
      tableStructure: result.rows,
      servicesCount: servicesCount.rows[0].count,
      sampleService: sampleService,
      needsMigration: result.rows.some((col: any) => col.column_name === 'title_en')
    })
    
  } catch (error) {
    console.error('Error checking database structure:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database structure',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
