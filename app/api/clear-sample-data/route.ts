import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database/connection'

export async function POST(request: NextRequest) {
  try {
    console.log('Clearing sample data...')
    
    // Delete all sample data
    await pool.query('DELETE FROM team WHERE id IN (1, 2, 3)')
    await pool.query('DELETE FROM services WHERE id IN (1, 2, 3, 4, 5, 6)')
    await pool.query('DELETE FROM certificates WHERE id IN (1, 2, 3, 4)')
    
    console.log('Sample data cleared successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Sample data cleared successfully!'
    })
    
  } catch (error) {
    console.error('Error clearing sample data:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to clear sample data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
