// Add this at the top of the file
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Mock stats service
// In a real application, this would make API calls to your backend

interface UserStats {
  dailyUsage: { date: string; count: number }[]
  totalRequests: number
  toolUsage: { tool: string; count: number }[]
}

interface ActivityItem {
  id: string
  tool: string
  prompt: string
  timestamp: string
}

// Generate mock data for the past 7 days
const generateMockDailyUsage = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day) => ({
    date: day,
    count: Math.floor(Math.random() * 100),
  }))
}

// Generate mock tool usage data
const generateMockToolUsage = () => {
  return [
    { tool: "Explain Code", count: Math.floor(Math.random() * 100) + 50 },
    { tool: "Fix Bug", count: Math.floor(Math.random() * 80) + 20 },
    { tool: "Generate Regex", count: Math.floor(Math.random() * 60) + 10 },
  ]
}

// Generate mock recent activity
const generateMockActivity = () => {
  const activities: ActivityItem[] = []
  const tools = ["Explain Code", "Fix Bug", "Generate Regex"]
  const prompts = [
    "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }",
    "I need a regex to validate email addresses",
    "function sortArray(arr) { for (let i = 0; i < arr.length; i++) { for (let j = 0; j < arr.length; j++) { if (arr[i] < arr[j]) { let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp; } } } }",
  ]

  for (let i = 0; i < 10; i++) {
    const toolIndex = Math.floor(Math.random() * tools.length)
    const promptIndex = Math.floor(Math.random() * prompts.length)

    activities.push({
      id: `activity-${i}`,
      tool: tools[toolIndex],
      prompt: prompts[promptIndex],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    })
  }

  // Sort by timestamp, newest first
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Update the fetchUserStats function to use the actual API
export async function fetchUserStats(): Promise<UserStats> {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch stats")
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

// Update the fetchRecentActivity function similarly
export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/stats/activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch activity")
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}
