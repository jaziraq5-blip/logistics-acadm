"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FixDBPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fixDatabase = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      console.log('Starting database fix...')
      
      // First check database connection
      const checkResponse = await fetch('/api/check-db')
      const checkData = await checkResponse.json()
      
      if (!checkResponse.ok) {
        throw new Error('Database connection failed: ' + checkData.error)
      }
      
      console.log('Database connection OK:', checkData)
      
      // Run the migration
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Migration response:', data)

      if (response.ok) {
        setResult(data)
        alert('✅ Database fixed successfully! You can now add services.')
      } else {
        setError(data.error || 'Migration failed')
        alert('❌ Database fix failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      const errorMsg = 'Error: ' + (err instanceof Error ? err.message : 'Unknown error')
      setError(errorMsg)
      alert('❌ ' + errorMsg)
      console.error('Database fix error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🔧 Fix Database</CardTitle>
          <CardDescription>
            Fix the services table structure to resolve the "Failed to add service" error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button 
              onClick={fixDatabase} 
              disabled={isRunning}
              className="px-8 py-3 text-lg"
              size="lg"
            >
              {isRunning ? 'Fixing Database...' : '🔧 Fix Database Now'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>This will:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Add missing <code>image_url</code> column</li>
              <li>Rename <code>title_*</code> columns to <code>name_*</code></li>
              <li>Update existing services with image URLs</li>
            </ul>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">❌ Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ Success!</h3>
              <p className="text-green-700 mb-3">{result.message}</p>
              
              {result.tableStructure && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">📋 Updated Table Structure:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {result.tableStructure.map((col: any, index: number) => (
                      <div key={index} className="text-green-700 bg-green-100 p-2 rounded">
                        <strong>{col.column_name}:</strong> {col.data_type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              After fixing the database, go to <strong>/admin/services</strong> to add services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
