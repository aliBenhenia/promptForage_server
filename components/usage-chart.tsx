"use client"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface UsageChartProps {
  data: { date: string; count: number }[]
}

export function UsageChart({ data }: UsageChartProps) {
  // If no data is provided, create sample data
  const chartData =
    data.length > 0
      ? data
      : [
          { date: "Mon", count: 12 },
          { date: "Tue", count: 18 },
          { date: "Wed", count: 5 },
          { date: "Thu", count: 8 },
          { date: "Fri", count: 23 },
          { date: "Sat", count: 7 },
          { date: "Sun", count: 10 },
        ]

  return (
    <Chart>
      <ChartContainer className="h-full w-full" data={chartData} xField="date" yField="count">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            <ChartTooltip>
              <ChartTooltipContent className="bg-background border-border">
                {({ payload }) => {
                  if (!payload?.length) return null
                  const { date, count } = payload[0].payload
                  return (
                    <div className="p-2">
                      <div className="text-sm font-medium">{date}</div>
                      <div className="text-xs text-muted-foreground">{count} requests</div>
                    </div>
                  )
                }}
              </ChartTooltipContent>
            </ChartTooltip>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Chart>
  )
}
