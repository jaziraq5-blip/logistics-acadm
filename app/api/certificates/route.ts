import { NextRequest, NextResponse } from 'next/server'
import { CertificateModel } from '@/lib/database/models'

// GET /api/certificates - Get all certificates
export async function GET() {
  try {
    const certificates = await CertificateModel.getAll()
    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

// POST /api/certificates - Create a new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating certificate with data:', body)
    
    const certificate = await CertificateModel.create(body)
    console.log('Certificate created successfully:', certificate)
    
    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Error creating certificate:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = {
      error: 'Failed to create certificate',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}
