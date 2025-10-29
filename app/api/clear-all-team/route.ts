import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database/connection'

export async function POST(request: NextRequest) {
  try {
    console.log('Clearing all team data...')
    
    // Delete all team data
    await pool.query('DELETE FROM team')
    
    console.log('All team data cleared successfully')
    
    return NextResponse.json({
      success: true,
      message: 'All team data cleared successfully!'
    })
    
  } catch (error) {
    console.error('Error clearing team data:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to clear team data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
