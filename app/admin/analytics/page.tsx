"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer,
  Globe,
  Calendar,
  BarChart3
} from "lucide-react"

interface AnalyticsData {
  totalVisitors: number
  totalPageViews: number
  bounceRate: number
  avgSessionDuration: string
  topPages: Array<{ page: string; views: number }>
  trafficSources: Array<{ source: string; percentage: number }>
  monthlyStats: Array<{ month: string; visitors: number; pageViews: number }>
}

const mockData: AnalyticsData = {
  totalVisitors: 12543,
  totalPageViews: 45678,
  bounceRate: 23.5,
  avgSessionDuration: "2:34",
  topPages: [
    { page: "الخدمات", views: 1234 },
    { page: "الصفحة الرئيسية", views: 987 },
    { page: "اتصل بنا", views: 654 },
    { page: "من نحن", views: 432 },
    { page: "الشهادات", views: 321 }
  ],
  trafficSources: [
    { source: "البحث المباشر", percentage: 45 },
    { source: "Google", percentage: 30 },
    { source: "Facebook", percentage: 15 },
    { source: "LinkedIn", percentage: 7 },
    { source: "أخرى", percentage: 3 }
  ],
  monthlyStats: [
    { month: "يناير", visitors: 1200, pageViews: 4500 },
    { month: "فبراير", visitors: 1350, pageViews: 5200 },
    { month: "مارس", visitors: 1100, pageViews: 4100 },
    { month: "أبريل", visitors: 1450, pageViews: 5800 },
    { month: "مايو", visitors: 1600, pageViews: 6200 },
    { month: "يونيو", visitors: 1800, pageViews: 7200 }
  ]
}

export default function AdminAnalytics() {
  const { isAuthenticated, loading } = useAdmin()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData>(mockData)
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  const getChangeIcon = (current: number, previous: number) => {
    return current > previous ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getChangeColor = (current: number, previous: number) => {
    return current > previous ? "text-green-600" : "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إحصائيات الموقع</h1>
            <p className="text-gray-600">تحليل أداء الموقع وحركة الزوار</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedPeriod === "7d" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("7d")}
              size="sm"
            >
              7 أيام
            </Button>
            <Button
              variant={selectedPeriod === "30d" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("30d")}
              size="sm"
            >
              30 يوم
            </Button>
            <Button
              variant={selectedPeriod === "90d" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("90d")}
              size="sm"
            >
              90 يوم
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الزوار</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalVisitors.toLocaleString()}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12% من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المشاهدات</CardTitle>
              <Eye className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalPageViews.toLocaleString()}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+8% من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">معدل الارتداد</CardTitle>
              <MousePointer className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.bounceRate}%</div>
              <div className="flex items-center space-x-1 text-xs text-red-600">
                <TrendingDown className="h-3 w-3" />
                <span>-2% من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">متوسط مدة الجلسة</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.avgSessionDuration}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+15% من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>الصفحات الأكثر زيارة</CardTitle>
              <CardDescription>أكثر الصفحات شعبية في الموقع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{page.page}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">مشاهدة</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>مصادر الزيارات</CardTitle>
              <CardDescription>من أين يأتي زوار الموقع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trafficSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{source.source}</span>
                      <span className="text-sm text-gray-500">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Stats */}
        <Card>
          <CardHeader>
            <CardTitle>الإحصائيات الشهرية</CardTitle>
            <CardDescription>تطور الزوار والمشاهدات على مدار الأشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">الشهر</th>
                    <th className="text-right py-3 px-4">الزوار</th>
                    <th className="text-right py-3 px-4">المشاهدات</th>
                    <th className="text-right py-3 px-4">النمو</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthlyStats.map((stat, index) => {
                    const previousMonth = index > 0 ? data.monthlyStats[index - 1] : null
                    const growth = previousMonth 
                      ? ((stat.visitors - previousMonth.visitors) / previousMonth.visitors * 100)
                      : 0
                    
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{stat.month}</td>
                        <td className="py-3 px-4">{stat.visitors.toLocaleString()}</td>
                        <td className="py-3 px-4">{stat.pageViews.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            {growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : growth < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : null}
                            <span className={growth > 0 ? "text-green-600" : growth < 0 ? "text-red-600" : "text-gray-600"}>
                              {growth > 0 ? "+" : ""}{growth.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>أدوات مفيدة لتحليل الموقع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>تقرير مفصل</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>تحليل المناطق</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>مقارنة الفترات</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

