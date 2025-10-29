import { NextRequest, NextResponse } from 'next/server'
import { ServiceModel } from '@/lib/database/models'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return NextResponse.json({
        error: 'Service ID is required'
      }, { status: 400 })
    }
    
    console.log('Deleting service with ID:', id)
    
    const result = await ServiceModel.delete(id)
    
    if (result) {
      console.log('Service deleted successfully:', result)
      return NextResponse.json({
        success: true,
        message: 'Service deleted successfully',
        deletedService: result
      })
    } else {
      return NextResponse.json({
        error: 'Service not found'
      }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({
      error: 'Failed to delete service',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
