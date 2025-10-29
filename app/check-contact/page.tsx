"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Wrench } from "lucide-react"

interface CheckResult {
  success: boolean
  message?: string
  error?: string
  details?: string
  needsCreation?: boolean
  structure?: any[]
  testInsert?: string
}

export default function CheckContactPage() {
  const [result, setResult] = useState<CheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [fixLoading, setFixLoading] = useState(false)
  const [fixMessage, setFixMessage] = useState<string | null>(null)

  const checkContactTable = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/check-contact-table')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error checking contact table:", error)
      setResult({
        success: false,
        error: `Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`
      })
    } finally {
      setLoading(false)
    }
  }

  const fixContactTable = async () => {
    setFixLoading(true)
    setFixMessage(null)
    try {
      const response = await fetch('/api/check-contact-table', { method: 'POST' })
      const data = await response.json()
      if (response.ok) {
        setFixMessage(data.message || "Contact table fixed successfully!")
        await checkContactTable() // Re-check after fixing
      } else {
        setFixMessage(data.error || "Failed to fix contact table.")
      }
    } catch (error) {
      console.error("Error fixing contact table:", error)
      setFixMessage(`Error fixing contact table: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setFixLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg p-6">
          <CardTitle className="text-3xl font-bold flex items-center">
            <RefreshCw className="mr-3 h-7 w-7" /> Contact Messages Database Checker & Fixer
          </CardTitle>
          <CardDescription className="text-blue-100 mt-2">
            Check and fix the `contact_messages` table structure to ensure contact form submissions work.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex space-x-4">
            <Button onClick={checkContactTable} disabled={loading || fixLoading} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg">
              {loading ? "Checking..." : <><RefreshCw className="mr-2 h-5 w-5" /> Check Contact Table</>}
            </Button>
            <Button onClick={fixContactTable} disabled={loading || fixLoading || !result?.needsCreation} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 text-lg">
              {fixLoading ? "Fixing..." : <><Wrench className="mr-2 h-5 w-5" /> Fix Contact Table</>}
            </Button>
          </div>

          {fixMessage && (
            <div className={`p-4 rounded-md ${fixMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {fixMessage}
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">Contact Table Status</h3>
              
              <div className={`p-4 rounded-md border ${
                result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <h4 className={`text-lg font-semibold ${result.success ? "text-green-800" : "text-red-800"}`}>
                    {result.success ? "✅ Contact Table Working" : "❌ Contact Table Issues"}
                  </h4>
                </div>
                <p className={`mt-2 ${result.success ? "text-green-700" : "text-red-700"}`}>
                  {result.message || result.error}
                </p>
                {result.details && (
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Details:</strong> {result.details}
                  </p>
                )}
              </div>

              {result.needsCreation && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="text-lg font-semibold text-yellow-800 flex items-center mb-2">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Action Required
                  </h4>
                  <p className="text-yellow-700">
                    The contact_messages table does not exist. Click "Fix Contact Table" to create it.
                  </p>
                </div>
              )}

              {result.structure && result.structure.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mt-8">Table Structure</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Column Name</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Data Type</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Required</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.structure.map((col: any, i: number) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-2 px-4 text-sm text-gray-800">{col.column_name}</td>
                            <td className="py-2 px-4 text-sm text-gray-800">{col.data_type}</td>
                            <td className="py-2 px-4 text-sm text-gray-800">{col.is_nullable === 'NO' ? 'Yes' : 'No'}</td>
                            <td className="py-2 px-4 text-sm text-gray-800">{col.column_default || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.testInsert && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="text-lg font-semibold text-green-800 flex items-center mb-2">
                    <CheckCircle className="mr-2 h-5 w-5" /> Test Results
                  </h4>
                  <p className="text-green-700">
                    Test insert: <strong>{result.testInsert}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              After fixing, test the contact form at <strong>/contact</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
