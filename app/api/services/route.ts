import { NextRequest, NextResponse } from 'next/server'
import { ServiceModel } from '@/lib/database/models'
import { testConnection } from '@/lib/database/connection'

// GET /api/services - Get all services
export async function GET() {
  try {
    // quick DB health check to fail fast with a helpful status
    const ok = await testConnection()
    if (!ok) {
      console.error('Database not available when fetching services')
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
    }

    const services = await ServiceModel.getAll()
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    // Return limited error details to the client; keep verbose logs server-side
    return NextResponse.json(
      { error: 'Failed to fetch services', details: process.env.NODE_ENV === 'production' ? undefined : message },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    // ensure DB is reachable before attempting create
    const ok = await testConnection()
    if (!ok) {
      console.error('Database not available when creating service')
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
    }

    const body = await request.json()
    console.log('Creating service with data:', body)
    
    const service = await ServiceModel.create(body)
    console.log('Service created successfully:', service)
    
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = {
      error: 'Failed to create service',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}