"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchPostsScrapedOverTime } from "@/lib/api/dashboard"
import { type AreaChartData } from "@/lib/types/dashboard"

const chartConfig = {
  post: {
    label: "Posts",
    color: "hsl(var(--post))",
  },
} satisfies ChartConfig

export function PostScrapedOverTime() {
  const [chartData, setChartData] = useState<AreaChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchPostsScrapedOverTime()
        setChartData(data)
      } catch (err) {
        setError("Failed to fetch time series data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts Scraped over Time</CardTitle>
          <CardDescription>within the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error && chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts Scraped over Time</CardTitle>
          <CardDescription>within the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts Scraped over Time</CardTitle>
        <CardDescription>within the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RechartsAreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
            height={300}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="post"
              type="monotone"
              stroke="var(--color-post)"
              fill="var(--color-post)"
              fillOpacity={0.2}
              strokeWidth={2}
              activeDot={{ r: 5 }}
            />
          </RechartsAreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
