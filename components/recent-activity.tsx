"use client"

import { useEffect, useState } from "react"
import { fetchRecentActivity } from "@/services/stats-service"

interface ActivityItem {
  id: string
  tool: string
  prompt: string
  timestamp: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchRecentActivity()
        setActivities(data)
      } catch (error) {
        console.error("Failed to load activities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-5 w-1/4 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-11/12 animate-pulse rounded bg-muted"></div>
            <div className="h-3 w-1/6 animate-pulse rounded bg-muted"></div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No recent activity found. Try using some tools!</div>
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b pb-4 last:border-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium">{activity.tool}</h4>
            <span className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{activity.prompt}</p>
        </div>
      ))}
    </div>
  )
}
