import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET() {
  try {
    // Simple database connection test
    const result = await query('SELECT NOW() as current_time')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      currentTime: result.rows[0].current_time
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
