import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET() {
  try {
    // Check what columns actually exist in services table
    const columns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    // Try to get a sample service
    let sampleService = null
    try {
      const result = await query('SELECT * FROM services LIMIT 1')
      sampleService = result.rows[0]
    } catch (err) {
      console.log('No services or error:', err)
    }
    
    // Try to create a service with the current structure
    let createError = null
    try {
      const testResult = await query(`
        INSERT INTO services (name_en, name_ar, name_ro, description_en, description_ar, description_ro, icon, image_url, features, is_active, sort_order) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *
      `, [
        'Test',
        'Test', 
        'Test',
        'Test',
        'Test',
        'Test',
        'Ship',
        '/test.jpg',
        '[]',
        true,
        0
      ])
      
      // Delete the test
      await query('DELETE FROM services WHERE id = $1', [testResult.rows[0].id])
      
    } catch (err) {
      createError = err instanceof Error ? err.message : 'Unknown error'
    }
    
    return NextResponse.json({
      columns: columns.rows,
      sampleService: sampleService,
      createError: createError,
      hasTitleColumns: columns.rows.some((col: any) => col.column_name.startsWith('title_')),
      hasNameColumns: columns.rows.some((col: any) => col.column_name.startsWith('name_')),
      hasImageUrl: columns.rows.some((col: any) => col.column_name === 'image_url')
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}