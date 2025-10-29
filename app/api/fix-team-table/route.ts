import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function POST() {
  try {
    console.log('🔧 Fixing team_members table...')
    
    // Step 1: Check current structure
    const currentStructure = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'team_members' 
      ORDER BY ordinal_position
    `)
    
    console.log('Current team_members structure:', currentStructure.rows)
    
    // Step 2: Add missing columns if they don't exist
    const requiredColumns = [
      { name: 'image_url', type: 'VARCHAR(500)' },
      { name: 'linkedin_url', type: 'VARCHAR(500)' },
      { name: 'experience_years', type: 'INTEGER' }
    ]
    
    for (const col of requiredColumns) {
      try {
        await query(`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`)
        console.log(`✅ Added ${col.name} column`)
      } catch (err) {
        console.log(`${col.name} column already exists or error:`, err)
      }
    }
    
    // Step 3: Check if we have title_* columns and rename them
    const titleColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'team_members' AND column_name LIKE 'title_%'
    `)
    
    console.log('Title columns found:', titleColumns.rows)
    
    if (titleColumns.rows.length > 0) {
      // Rename title_en to name_en
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_en')) {
        await query('ALTER TABLE team_members RENAME COLUMN title_en TO name_en')
        console.log('✅ Renamed title_en to name_en')
      }
      
      // Rename title_ar to name_ar
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_ar')) {
        await query('ALTER TABLE team_members RENAME COLUMN title_ar TO name_ar')
        console.log('✅ Renamed title_ar to name_ar')
      }
      
      // Rename title_ro to name_ro
      if (titleColumns.rows.some((col: any) => col.column_name === 'title_ro')) {
        await query('ALTER TABLE team_members RENAME COLUMN title_ro TO name_ro')
        console.log('✅ Renamed title_ro to name_ro')
      }
    }
    
    // Step 4: Get final structure
    const finalStructure = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'team_members' 
      ORDER BY ordinal_position
    `)
    
    console.log('Final team_members structure:', finalStructure.rows)
    
    // Step 5: Test creating a team member
    try {
      const testMember = await query(`
        INSERT INTO team_members (name_en, name_ar, name_ro, position_en, position_ar, position_ro, bio_en, bio_ar, bio_ro, email, phone, image_url, linkedin_url, experience_years) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING *
      `, [
        'Test Member',
        'عضو تجريبي', 
        'Membru Test',
        'Test Position',
        'منصب تجريبي',
        'Poziție Test',
        'Test bio',
        'سيرة تجريبية',
        'Biografie test',
        'test@example.com',
        '+1234567890',
  '/uploads/test.jpg',
        'https://linkedin.com/test',
        5
      ])
      
      console.log('✅ Test team member created successfully:', testMember.rows[0])
      
      // Delete the test member
      await query('DELETE FROM team_members WHERE id = $1', [testMember.rows[0].id])
      console.log('✅ Test team member deleted')
      
    } catch (testErr) {
      console.error('❌ Test team member creation failed:', testErr)
      throw testErr
    }
    
    return NextResponse.json({
      success: true,
      message: 'Team members table fixed successfully! You can now add team members.',
      beforeStructure: currentStructure.rows,
      afterStructure: finalStructure.rows
    })
    
  } catch (error) {
    console.error('❌ Team table fix failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fix team members table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
