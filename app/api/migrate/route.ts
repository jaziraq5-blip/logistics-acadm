import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Running database migration...')
    
    // Add image_url column if it doesn't exist
    await query('ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)')
    console.log('✅ Added image_url column')
    
    // Check if we need to rename columns
    const columnCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name = 'title_en'
    `)
    
    if (columnCheck.rows.length > 0) {
      // Rename columns from title_* to name_*
      await query('ALTER TABLE services RENAME COLUMN title_en TO name_en')
      await query('ALTER TABLE services RENAME COLUMN title_ar TO name_ar')
      await query('ALTER TABLE services RENAME COLUMN title_ro TO name_ro')
      console.log('✅ Renamed title columns to name columns')
    }
    
  // Update existing services with default image URLs (use uploads path)
  await query("UPDATE services SET image_url = '/uploads/sea-freight.jpg' WHERE name_en = 'Sea Freight'")
  await query("UPDATE services SET image_url = '/uploads/air-freight.jpg' WHERE name_en = 'Air Freight'")
  await query("UPDATE services SET image_url = '/uploads/land-transport.jpg' WHERE name_en = 'Land Transport'")
  await query("UPDATE services SET image_url = '/uploads/customs-clearance.jpg' WHERE name_en = 'Customs Clearance'")
  await query("UPDATE services SET image_url = '/uploads/import-export.jpg' WHERE name_en = 'Import & Export'")
  await query("UPDATE services SET image_url = '/uploads/warehousing.jpg' WHERE name_en = 'Warehousing & Distribution'")
  console.log('✅ Updated existing services with image URLs (uploads path)')
    
    // Get the final table structure
    const result = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position
    `)
    
    console.log('📋 Services table structure:')
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`)
    })
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      tableStructure: result.rows
    })
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
