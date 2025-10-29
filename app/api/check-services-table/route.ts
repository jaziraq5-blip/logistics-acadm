import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET() {
  try {
    // Check the actual table structure
    const tableStructure = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    // Try to get a sample service to see what columns exist
    let sampleService = null
    try {
      const sampleResult = await query('SELECT * FROM services LIMIT 1')
      sampleService = sampleResult.rows[0]
    } catch (err) {
      console.log('No services found or table structure issue')
    }
    
    // Check if we have any services
    const servicesCount = await query('SELECT COUNT(*) as count FROM services')
    
    // Try to create a test service to see what error we get
    let createTestError = null
    try {
      const testService = await query(`
        INSERT INTO services (name_en, name_ar, name_ro, description_en, description_ar, description_ro, icon, image_url, features, is_active, sort_order) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *
      `, [
        'Test Service',
        'خدمة تجريبية', 
        'Serviciu Test',
        'Test description',
        'وصف تجريبي',
        'Descriere test',
        'Ship',
  '/uploads/test.jpg',
        '[]',
        true,
        0
      ])
      
      // Delete the test service
      await query('DELETE FROM services WHERE id = $1', [testService.rows[0].id])
      
    } catch (err) {
      createTestError = err instanceof Error ? err.message : 'Unknown error'
    }
    
    return NextResponse.json({
      success: true,
      tableStructure: tableStructure.rows,
      servicesCount: servicesCount.rows[0].count,
      sampleService: sampleService,
      createTestError: createTestError,
      needsFix: tableStructure.rows.some((col: any) => col.column_name === 'title_en') || 
                !tableStructure.rows.some((col: any) => col.column_name === 'image_url')
    })
    
  } catch (error) {
    console.error('Error checking services table:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check services table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
