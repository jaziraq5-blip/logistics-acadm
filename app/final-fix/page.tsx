"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinalFixPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runFinalFix = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      console.log('Starting final fix...')
      
      const response = await fetch('/api/fix-services-final', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Final fix response:', data)

      if (response.ok) {
        setResult(data)
        alert('✅ Services table fixed! You can now add services without errors.')
      } else {
        setError(data.error || 'Fix failed')
        alert('❌ Fix failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      const errorMsg = 'Error: ' + (err instanceof Error ? err.message : 'Unknown error')
      setError(errorMsg)
      alert('❌ ' + errorMsg)
      console.error('Final fix error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">🔧 Final Services Fix</CardTitle>
          <CardDescription className="text-lg">
            This will fix the "Failed to add service" error once and for all
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button 
              onClick={runFinalFix} 
              disabled={isRunning}
              className="px-12 py-4 text-xl bg-red-600 hover:bg-red-700"
              size="lg"
            >
              {isRunning ? 'Fixing Database...' : '🔧 FIX SERVICES NOW'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>This final fix will:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Check current database structure</li>
              <li>Add missing <code>image_url</code> column</li>
              <li>Rename <code>title_*</code> columns to <code>name_*</code></li>
              <li>Test creating a service to verify it works</li>
              <li>Show before/after structure comparison</li>
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
              <h3 className="font-semibold text-green-800 mb-2">✅ SUCCESS!</h3>
              <p className="text-green-700 mb-3 text-lg">{result.message}</p>
              
              {result.beforeStructure && (
                <div className="mb-4">
                  <h4 className="font-medium text-green-800 mb-2">📋 Before Fix:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {result.beforeStructure.map((col: any, index: number) => (
                      <div key={index} className="text-gray-700 bg-gray-100 p-2 rounded">
                        <strong>{col.column_name}:</strong> {col.data_type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result.afterStructure && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">📋 After Fix:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {result.afterStructure.map((col: any, index: number) => (
                      <div key={index} className="text-green-700 bg-green-100 p-2 rounded">
                        <strong>{col.column_name}:</strong> {col.data_type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result.testPassed && (
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-green-800 font-medium">✅ Test service creation passed!</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              After the fix, go to <strong>/admin/services</strong> and try adding a service.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
