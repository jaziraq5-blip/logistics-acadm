import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function POST() {
  try {
    console.log('🔧 Quick fixing services table...')
    
    // Add image_url column if it doesn't exist
    await query('ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)')
    console.log('✅ Added image_url column')
    
    // Check if we have title_* columns that need to be renamed
    const titleColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name LIKE 'title_%'
    `)
    
    if (titleColumns.rows.length > 0) {
      console.log('Found title columns to rename:', titleColumns.rows)
      
      // Rename title_en to name_en if it exists
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_en')) {
        await query('ALTER TABLE services RENAME COLUMN title_en TO name_en')
        console.log('✅ Renamed title_en to name_en')
      }
      
      // Rename title_ar to name_ar if it exists
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_ar')) {
        await query('ALTER TABLE services RENAME COLUMN title_ar TO name_ar')
        console.log('✅ Renamed title_ar to name_ar')
      }
      
      // Rename title_ro to name_ro if it exists
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_ro')) {
        await query('ALTER TABLE services RENAME COLUMN title_ro TO name_ro')
        console.log('✅ Renamed title_ro to name_ro')
      }
    }
    
    // Get the final table structure
    const result = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    console.log('📋 Final services table structure:')
    result.rows.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`)
    })
    
    return NextResponse.json({
      success: true,
      message: 'Services table fixed successfully! Now it works like certificates.',
      tableStructure: result.rows
    })
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fix services table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
