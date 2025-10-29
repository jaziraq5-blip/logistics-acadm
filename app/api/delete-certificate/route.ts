import { NextRequest, NextResponse } from 'next/server'
import { CertificateModel } from '@/lib/database/models'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return NextResponse.json({
        error: 'Certificate ID is required'
      }, { status: 400 })
    }
    
    console.log('Deleting certificate with ID:', id)
    
    const result = await CertificateModel.delete(id)
    
    if (result) {
      console.log('Certificate deleted successfully:', result)
      return NextResponse.json({
        success: true,
        message: 'Certificate deleted successfully',
        deletedCertificate: result
      })
    } else {
      return NextResponse.json({
        error: 'Certificate not found'
      }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Error deleting certificate:', error)
    return NextResponse.json({
      error: 'Failed to delete certificate',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
