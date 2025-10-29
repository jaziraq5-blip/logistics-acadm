"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, RefreshCw } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  database_url?: string
  error?: string
}

export default function TestDatabaseConnection() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/test-db-connection')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to test database connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Database Connection Test</h1>
          <p className="text-gray-600">Test the connection to your PostgreSQL database</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Configuration</span>
            </CardTitle>
            <CardDescription>
              Current database connection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Database URL:</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                  postgresql://user:password@localhost:5433/mydatabase
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Docker Container:</label>
                <p className="text-sm text-gray-900">my_postgres_db (Port 5433)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
            <CardDescription>
              Click the button below to test the database connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Database Connection
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>Test Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant={testResult.success ? "default" : "destructive"}>
                    {testResult.success ? "SUCCESS" : "FAILED"}
                  </Badge>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Message:</label>
                  <p className="text-sm text-gray-900">{testResult.message}</p>
                </div>

                {testResult.database_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Database URL:</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                      {testResult.database_url}
                    </p>
                  </div>
                )}

                {testResult.error && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Error Details:</label>
                    <p className="text-sm text-red-600 font-mono bg-red-50 p-2 rounded">
                      {testResult.error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• If the connection is successful, you can proceed to set up the database schema</li>
            <li>• If it fails, check that your Docker container is running: <code className="bg-blue-100 px-1 rounded">docker ps</code></li>
            <li>• Make sure the database is accessible on port 5433</li>
            <li>• Verify your DATABASE_URL environment variable is set correctly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
