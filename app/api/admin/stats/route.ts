import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database/connection'

export async function GET(request: NextRequest) {
  try {
    // Get services count
    const servicesResult = await pool.query('SELECT COUNT(*) as count FROM services')
    const servicesCount = servicesResult.rows[0]?.count || 0

    // Get certificates count
    const certificatesResult = await pool.query('SELECT COUNT(*) as count FROM certificates')
    const certificatesCount = certificatesResult.rows[0]?.count || 0

    // Get team members count
    const teamResult = await pool.query('SELECT COUNT(*) as count FROM team_members')
    const teamCount = teamResult.rows[0]?.count || 0

    // Get messages count
    const messagesResult = await pool.query('SELECT COUNT(*) as count FROM contact_messages')
    const messagesCount = messagesResult.rows[0]?.count || 0

    // Get unread messages count
    const unreadMessagesResult = await pool.query('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false')
    const unreadMessagesCount = unreadMessagesResult.rows[0]?.count || 0

    const stats = {
      services: parseInt(servicesCount),
      certificates: parseInt(certificatesCount),
      teamMembers: parseInt(teamCount),
      messages: parseInt(messagesCount),
      unreadMessages: parseInt(unreadMessagesCount)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch statistics',
        services: 0,
        certificates: 0,
        teamMembers: 0,
        messages: 0,
        unreadMessages: 0
      },
      { status: 500 }
    )
  }
}
