import { NextRequest, NextResponse } from 'next/server'
import { TeamMemberModel } from '@/lib/database/models'

// GET /api/team - Get all team members
export async function GET() {
  try {
    const teamMembers = await TeamMemberModel.getAll()
    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST /api/team - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const teamMember = await TeamMemberModel.create(body)
    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}