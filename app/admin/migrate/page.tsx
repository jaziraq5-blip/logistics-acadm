"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MigratePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        console.log('Migration successful:', data)
      } else {
        setError(data.error || 'Migration failed')
        console.error('Migration failed:', data)
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'))
      console.error('Migration error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Database Migration</CardTitle>
          <CardDescription>
            Run database migration to add image_url column and fix column names
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runMigration} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Migration...' : 'Run Migration'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800">Success!</h3>
              <p className="text-green-700 mb-2">{result.message}</p>
              
              {result.tableStructure && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Table Structure:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {result.tableStructure.map((col: any, index: number) => (
                      <li key={index}>• {col.column_name}: {col.data_type}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
