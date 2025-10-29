"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FixNowPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fixNow = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      console.log('Starting direct fix...')
      
      const response = await fetch('/api/fix-now-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Direct fix response:', data)

      if (response.ok) {
        setResult(data)
        alert('✅ Database fixed! Services should work now.')
      } else {
        setError(data.error || 'Fix failed')
        alert('❌ Fix failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      const errorMsg = 'Error: ' + (err instanceof Error ? err.message : 'Unknown error')
      setError(errorMsg)
      alert('❌ ' + errorMsg)
      console.error('Direct fix error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🔧 Fix Database Now</CardTitle>
          <CardDescription>
            Fix the services table structure to resolve the "Failed to add service" error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button 
              onClick={fixNow} 
              disabled={isRunning}
              className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isRunning ? 'Fixing...' : '🔧 Fix Database Now'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>This will fix:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Add missing <code>image_url</code> column</li>
              <li>Rename <code>title_en</code> to <code>name_en</code></li>
              <li>Rename <code>title_ar</code> to <code>name_ar</code></li>
              <li>Rename <code>title_ro</code> to <code>name_ro</code></li>
              <li>Test service creation</li>
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
              
              {result.finalStructure && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">📋 Fixed Table Structure:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {result.finalStructure.map((col: any, index: number) => (
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
              After fixing, go to <strong>/admin/services</strong> to add services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}