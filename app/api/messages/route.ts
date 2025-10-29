import { NextRequest, NextResponse } from 'next/server'
import { ContactMessageModel } from '@/lib/database/models'

// GET /api/messages - Get all contact messages
export async function GET() {
  try {
    const messages = await ContactMessageModel.getAll()
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = await ContactMessageModel.create(body)
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}
