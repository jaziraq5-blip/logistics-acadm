"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestMigrationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      console.log('Starting migration...')
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
        alert('Migration successful! You can now add services.')
      } else {
        setError(data.error || 'Migration failed')
        alert('Migration failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      const errorMsg = 'Network error: ' + (err instanceof Error ? err.message : 'Unknown error')
      setError(errorMsg)
      alert(errorMsg)
      console.error('Migration error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Database Migration</CardTitle>
          <CardDescription>
            Fix the services table to add image_url column and correct column names
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button 
              onClick={runMigration} 
              disabled={isRunning}
              className="px-8 py-3 text-lg"
              size="lg"
            >
              {isRunning ? 'Running Migration...' : '🔧 Run Migration'}
            </Button>
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
                  <h4 className="font-medium text-green-800 mb-2">📋 Table Structure:</h4>
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
              After running the migration, go to <strong>/admin/services</strong> to add services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
