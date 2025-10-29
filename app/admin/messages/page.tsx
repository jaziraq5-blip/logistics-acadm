"use client"

import { useAdmin } from "@/contexts/admin-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MessageSquare, User, Calendar, Trash2, Eye, Copy } from "lucide-react"

interface ContactMessage {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  service_type?: string
  message: string
  status: string
  is_read: boolean
  created_at: string
  updated_at: string
}

export default function AdminMessagesPage() {
  const { isAuthenticated, loading } = useAdmin()
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // Load messages from database
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        } else {
          console.error('Failed to load messages from database')
          setMessages([])
        }
      } catch (error) {
        console.error('Error loading messages:', error)
        setMessages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  const handleMarkAsRead = async (messageId: string) => {
    try {
      console.log('Marking message as read:', messageId)
      
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        setMessages(messages.map(m => 
          m.id === messageId ? { ...m, is_read: true } : m
        ))
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, is_read: true })
        }
        console.log("✅ Message marked as read:", messageId)
        alert('Message marked as read successfully!')
      } else {
        console.error('❌ Failed to mark message as read:', responseData)
        alert('Failed to mark message as read: ' + (responseData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('❌ Error marking message as read:', error)
      alert('Error marking message as read: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch(`/api/messages/${messageId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setMessages(messages.filter(m => m.id !== messageId))
          if (selectedMessage?.id === messageId) {
            setSelectedMessage(null)
          }
          console.log("Message deleted:", messageId)
          alert("Message deleted successfully!")
        } else {
          console.error('Failed to delete message')
          alert("Failed to delete message. Please try again.")
        }
      } catch (error) {
        console.error('Error deleting message:', error)
        alert("Error deleting message. Please try again.")
      }
    }
  }


  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      alert(`Email address copied to clipboard: ${email}`)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = email
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert(`Email address copied to clipboard: ${email}`)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600 mt-1">View and respond to contact form submissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={unreadCount > 0 ? "destructive" : "secondary"} className="text-sm">
                {unreadCount} Unread
              </Badge>
              <Badge variant="outline" className="text-sm">
                {messages.length} Total
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </CardTitle>
                <CardDescription>
                  Click on a message to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                        } ${!message.is_read ? 'bg-yellow-50' : ''}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {message.first_name} {message.last_name}
                              </h3>
                              {!message.is_read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {message.service_type || 'General Inquiry'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {selectedMessage.service_type || 'General Inquiry'}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{selectedMessage.first_name} {selectedMessage.last_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <a 
                              href={`mailto:${selectedMessage.email}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                              title="Click to send email"
                            >
                              {selectedMessage.email}
                            </a>
                          </div>
                          {selectedMessage.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <a 
                                href={`tel:${selectedMessage.phone}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                title="Click to call"
                              >
                                {selectedMessage.phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!selectedMessage.is_read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(selectedMessage.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyEmail(selectedMessage.email)}
                        title="Copy email address to clipboard"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Email
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Message:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
                  <p className="text-gray-600">
                    Choose a message from the list to view its details and respond.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}