import * as React from "react"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("rounded-md border", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    xField: string
    yField: string
    data: any[]
  }
>(({ className, xField, yField, data, ...props }, ref) => {
  return (
    <div className={cn("relative", className)} ref={ref} {...props}>
      {/* Chart content will be rendered here by recharts */}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("absolute z-10", className)} ref={ref} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)}
        ref={ref}
        {...props}
      />
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent }
