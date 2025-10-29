import { NextRequest, NextResponse } from 'next/server'
import { TeamMemberModel } from '@/lib/database/models'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return NextResponse.json({
        error: 'Team member ID is required'
      }, { status: 400 })
    }
    
    console.log('Deleting team member with ID:', id)
    
    const result = await TeamMemberModel.delete(id)
    
    if (result) {
      console.log('Team member deleted successfully:', result)
      return NextResponse.json({
        success: true,
        message: 'Team member deleted successfully',
        deletedMember: result
      })
    } else {
      return NextResponse.json({
        error: 'Team member not found'
      }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({
      error: 'Failed to delete team member',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
