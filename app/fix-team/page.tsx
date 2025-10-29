"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FixTeamPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fixTeamTable = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      console.log('Starting team table fix...')
      
      const response = await fetch('/api/fix-team-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Team table fix response:', data)

      if (response.ok) {
        setResult(data)
        alert('✅ Team members table fixed! You can now add team members.')
      } else {
        setError(data.error || 'Fix failed')
        alert('❌ Fix failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      const errorMsg = 'Error: ' + (err instanceof Error ? err.message : 'Unknown error')
      setError(errorMsg)
      alert('❌ ' + errorMsg)
      console.error('Team table fix error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🔧 Fix Team Members Table</CardTitle>
          <CardDescription>
            Fix the team_members table structure to resolve the "Failed to add team member" error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button 
              onClick={fixTeamTable} 
              disabled={isRunning}
              className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isRunning ? 'Fixing...' : '🔧 Fix Team Table Now'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>This will fix:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Add missing <code>image_url</code> column</li>
              <li>Add missing <code>linkedin_url</code> column</li>
              <li>Add missing <code>experience_years</code> column</li>
              <li>Rename <code>title_*</code> to <code>name_*</code> if needed</li>
              <li>Test team member creation</li>
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
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              After fixing, go to <strong>/admin/team</strong> to add team members.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
