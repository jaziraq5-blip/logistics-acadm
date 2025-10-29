import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET() {
  try {
    // Check the actual table structure
    const tableStructure = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'team_members' 
      ORDER BY ordinal_position
    `)
    
    // Try to get a sample team member to see what columns exist
    let sampleMember = null
    try {
      const sampleResult = await query('SELECT * FROM team_members LIMIT 1')
      sampleMember = sampleResult.rows[0]
    } catch (err) {
      console.log('No team members found or table structure issue')
    }
    
    // Check if we have any team members
    const membersCount = await query('SELECT COUNT(*) as count FROM team_members')
    
    // Try to create a test team member to see what error we get
    let createTestError = null
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
      
      // Delete the test member
      await query('DELETE FROM team_members WHERE id = $1', [testMember.rows[0].id])
      
    } catch (err) {
      createTestError = err instanceof Error ? err.message : 'Unknown error'
    }
    
    return NextResponse.json({
      success: true,
      tableStructure: tableStructure.rows,
      membersCount: membersCount.rows[0].count,
      sampleMember: sampleMember,
      createTestError: createTestError,
      needsFix: createTestError !== null
    })
    
  } catch (error) {
    console.error('Error checking team_members table:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check team_members table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
