import { NextRequest, NextResponse } from 'next/server'
import { testConnection } from '@/lib/database/connection'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL)
    
    const isConnected = await testConnection()
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Database connection successful!',
        database_url: process.env.DATABASE_URL
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed!',
        database_url: process.env.DATABASE_URL
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Database connection test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      database_url: process.env.DATABASE_URL
    }, { status: 500 })
  }
}
