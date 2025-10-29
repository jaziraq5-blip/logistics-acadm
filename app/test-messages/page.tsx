"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestMessagesPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testMessagesAPI = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('Testing messages API...')
      
      // Test 1: Get all messages
      const getResponse = await fetch('/api/messages')
      const messages = await getResponse.json()
      console.log('Messages:', messages)
      
      if (messages.length > 0) {
        const firstMessage = messages[0]
        console.log('First message:', firstMessage)
        
        // Test 2: Update read status
        const updateResponse = await fetch(`/api/messages/${firstMessage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_read: true }),
        })
        
        const updateResult = await updateResponse.json()
        console.log('Update result:', updateResult)
        
        setResult({
          success: true,
          message: 'Messages API test completed successfully',
          messagesCount: messages.length,
          firstMessage: firstMessage,
          updateResult: updateResult
        })
      } else {
        setResult({
          success: true,
          message: 'No messages found in database',
          messagesCount: 0
        })
      }
      
    } catch (error) {
      console.error('Test failed:', error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg p-6">
          <CardTitle className="text-3xl font-bold">Test Messages API</CardTitle>
          <CardDescription className="text-blue-100 mt-2">
            Test the contact messages API endpoints to verify they're working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <Button 
              onClick={testMessagesAPI} 
              disabled={loading}
              className="px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? 'Testing...' : 'Test Messages API'}
            </Button>
          </div>

          {result && (
            <div className={`p-4 rounded-md border ${
              result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                result.success ? "text-green-800" : "text-red-800"
              }`}>
                {result.success ? "✅ Test Results" : "❌ Test Failed"}
              </h3>
              <p className={`mb-3 ${result.success ? "text-green-700" : "text-red-700"}`}>
                {result.message || result.error}
              </p>
              
              {result.messagesCount !== undefined && (
                <p className="text-sm text-gray-600">
                  <strong>Messages in database:</strong> {result.messagesCount}
                </p>
              )}
              
              {result.firstMessage && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-gray-800 mb-2">First Message:</h4>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(result.firstMessage, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.updateResult && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-gray-800 mb-2">Update Result:</h4>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(result.updateResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Check the browser console for detailed logs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
