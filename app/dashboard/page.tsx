"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsageChart } from "@/components/usage-chart"
import { RecentActivity } from "@/components/recent-activity"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { fetchUserStats } from "@/services/stats-service"

interface UserStats {
  dailyUsage: { date: string; count: number }[]
  totalRequests: number
  toolUsage: { tool: string; count: number }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
      return
    }

    const loadStats = async () => {
      try {
        const data = await fetchUserStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadStats()
    }
  }, [isAuthenticated, router, isLoading])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Lifetime prompt requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,000</div>
            <p className="text-xs text-muted-foreground">Requests per day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.toolUsage?.sort((a, b) => b.count - a.count)[0]?.tool || "None"}
            </div>
            <p className="text-xs text-muted-foreground">Based on your activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.dailyUsage?.[stats.dailyUsage.length - 1]?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Out of 1,000 daily limit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Your prompt request usage over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <UsageChart data={stats?.dailyUsage || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent prompt requests</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
