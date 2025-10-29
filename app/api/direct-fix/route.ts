import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function POST() {
  try {
    console.log('🔧 Direct database fix starting...')
    
    // First, let's see what we actually have
    const currentStructure = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    console.log('Current structure:', currentStructure.rows)
    
    // Add image_url column if it doesn't exist
    try {
      await query('ALTER TABLE services ADD COLUMN image_url VARCHAR(500)')
      console.log('✅ Added image_url column')
    } catch (err) {
      console.log('image_url column already exists or error:', err)
    }
    
    // Check if we have title_* columns and rename them
    const titleColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name LIKE 'title_%'
    `)
    
    console.log('Title columns found:', titleColumns.rows)
    
    if (titleColumns.rows.length > 0) {
      // Rename title_en to name_en
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_en')) {
        await query('ALTER TABLE services RENAME COLUMN title_en TO name_en')
        console.log('✅ Renamed title_en to name_en')
      }
      
      // Rename title_ar to name_ar
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_ar')) {
        await query('ALTER TABLE services RENAME COLUMN title_ar TO name_ar')
        console.log('✅ Renamed title_ar to name_ar')
      }
      
      // Rename title_ro to name_ro
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_ro')) {
        await query('ALTER TABLE services RENAME COLUMN title_ro TO name_ro')
        console.log('✅ Renamed title_ro to name_ro')
      }
    }
    
    // Get final structure
    const finalStructure = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    console.log('Final structure:', finalStructure.rows)
    
    // Test creating a service
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
      
      console.log('✅ Test service created successfully:', testService.rows[0])
      
      // Delete the test service
      await query('DELETE FROM services WHERE id = $1', [testService.rows[0].id])
      console.log('✅ Test service deleted')
      
    } catch (testErr) {
      console.error('❌ Test service creation failed:', testErr)
      throw testErr
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database fixed successfully! Services should work now.',
      beforeStructure: currentStructure.rows,
      afterStructure: finalStructure.rows
    })
    
  } catch (error) {
    console.error('❌ Direct fix failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fix database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
