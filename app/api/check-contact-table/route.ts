import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET() {
  try {
    console.log('🔍 Checking contact_messages table...')
    
    // Check if table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_messages'
      );
    `)
    
    console.log('Table exists:', tableExists.rows[0].exists)
    
    if (!tableExists.rows[0].exists) {
      return NextResponse.json({
        success: false,
        error: 'contact_messages table does not exist',
        needsCreation: true
      })
    }
    
    // Get table structure
    const structure = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'contact_messages' 
      ORDER BY ordinal_position
    `)
    
    console.log('Table structure:', structure.rows)
    
    // Check if we can insert a test record
    try {
      const testInsert = await query(`
        INSERT INTO contact_messages (first_name, last_name, email, message, status, is_read) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id
      `, ['Test', 'User', 'test@example.com', 'Test message', 'new', false])
      
      console.log('✅ Test insert successful:', testInsert.rows[0])
      
      // Delete the test record
      await query('DELETE FROM contact_messages WHERE id = $1', [testInsert.rows[0].id])
      console.log('✅ Test record deleted')
      
      return NextResponse.json({
        success: true,
        message: 'contact_messages table is working correctly',
        structure: structure.rows,
        testInsert: 'successful'
      })
      
    } catch (insertError) {
      console.error('❌ Test insert failed:', insertError)
      return NextResponse.json({
        success: false,
        error: 'Test insert failed',
        details: insertError instanceof Error ? insertError.message : 'Unknown error',
        structure: structure.rows
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking contact_messages table:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check contact_messages table',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST() {
  try {
    console.log('🔧 Creating contact_messages table...')
    
    // Create the contact_messages table
    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(200) NOT NULL,
        last_name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(200),
        service_type VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)
    
    console.log('✅ contact_messages table created')
    
    // Test insert
    const testInsert = await query(`
      INSERT INTO contact_messages (first_name, last_name, email, message, status, is_read) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `, ['Test', 'User', 'test@example.com', 'Test message', 'new', false])
    
    console.log('✅ Test insert successful:', testInsert.rows[0])
    
    // Delete the test record
    await query('DELETE FROM contact_messages WHERE id = $1', [testInsert.rows[0].id])
    console.log('✅ Test record deleted')
    
    return NextResponse.json({
      success: true,
      message: 'contact_messages table created and tested successfully'
    })
    
  } catch (error) {
    console.error('❌ Error creating contact_messages table:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create contact_messages table',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
