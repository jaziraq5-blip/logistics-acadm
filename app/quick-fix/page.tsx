"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function QuickFixPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const quickFix = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      console.log('Starting quick fix...')
      
      const response = await fetch('/api/quick-fix-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Quick fix response:', data)

      if (response.ok) {
        setResult(data)
        alert('✅ Services table fixed! Now it works exactly like certificates.')
      } else {
        setError(data.error || 'Quick fix failed')
        alert('❌ Quick fix failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      const errorMsg = 'Error: ' + (err instanceof Error ? err.message : 'Unknown error')
      setError(errorMsg)
      alert('❌ ' + errorMsg)
      console.error('Quick fix error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">⚡ Quick Fix Services</CardTitle>
          <CardDescription>
            Make services work exactly like certificates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button 
              onClick={quickFix} 
              disabled={isRunning}
              className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isRunning ? 'Fixing...' : '⚡ Quick Fix Now'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>This will make services work exactly like certificates:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Add <code>image_url</code> column</li>
              <li>Rename <code>title_*</code> to <code>name_*</code></li>
              <li>Fix database structure mismatch</li>
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
                  <h4 className="font-medium text-green-800 mb-2">📋 Services Table Structure:</h4>
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
              After the fix, go to <strong>/admin/services</strong> to add services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
