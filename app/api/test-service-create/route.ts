import { NextResponse } from 'next/server'
import { ServiceModel } from '@/lib/database/models'

export async function POST() {
  try {
    console.log('Testing service creation...')
    
    // Try to create a minimal service
    const testServiceData = {
      name_en: 'Test Service',
      name_ar: 'خدمة تجريبية',
      name_ro: 'Serviciu Test',
      description_en: 'Test description',
      description_ar: 'وصف تجريبي',
      description_ro: 'Descriere test',
  icon: 'Ship',
  image_url: '/uploads/test.jpg',
      features: [],
      is_active: true,
      sort_order: 0
    }
    
    console.log('Creating service with data:', testServiceData)
    
    const service = await ServiceModel.create(testServiceData)
    console.log('Service created successfully:', service)
    
    return NextResponse.json({
      success: true,
      message: 'Test service created successfully',
      service: service
    })
    
  } catch (error) {
    console.error('Error creating test service:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = {
      success: false,
      error: 'Failed to create test service',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}
