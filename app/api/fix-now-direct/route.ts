import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function POST() {
  try {
    console.log('🔧 Direct database fix starting...')
    
    // Step 1: Add missing image_url column
    try {
      await query('ALTER TABLE services ADD COLUMN image_url VARCHAR(500)')
      console.log('✅ Added image_url column')
    } catch (err) {
      console.log('image_url column already exists or error:', err)
    }
    
    // Step 2: Rename title_* columns to name_*
    try {
      await query('ALTER TABLE services RENAME COLUMN title_en TO name_en')
      console.log('✅ Renamed title_en to name_en')
    } catch (err) {
      console.log('title_en rename error:', err)
    }
    
    try {
      await query('ALTER TABLE services RENAME COLUMN title_ar TO name_ar')
      console.log('✅ Renamed title_ar to name_ar')
    } catch (err) {
      console.log('title_ar rename error:', err)
    }
    
    try {
      await query('ALTER TABLE services RENAME COLUMN title_ro TO name_ro')
      console.log('✅ Renamed title_ro to name_ro')
    } catch (err) {
      console.log('title_ro rename error:', err)
    }
    
    // Step 3: Check final structure
    const finalStructure = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    console.log('Final structure:', finalStructure.rows)
    
    // Step 4: Test creating a service
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
      finalStructure: finalStructure.rows
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
