"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart as RechartsPieChart } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchSeverityDistribution, fetchSentimentDistribution } from "@/lib/api/dashboard"
import { PieChartData } from "@/lib/types/dashboard"

const chartConfig1 = {
  posts: {
    label: "Posts",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--neutral))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--low))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--medium))",
  },
  high: {
    label: "High",
    color: "hsl(var(--high))",
  },
  critical: {
    label: "Critical",
    color: "hsl(var(--critical))",
  },
} satisfies ChartConfig

const chartConfig2 = {
  posts: {
    label: "Posts",
  },
  positive: {
    label: "Positive",
    color: "hsl(var(--pos))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--neu))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--neg))",
  },
} satisfies ChartConfig

export function PieChart1() {
  const [chartData, setChartData] = useState<PieChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchSeverityDistribution()
        setChartData(data)
      } catch (err) {
        setError("Failed to fetch severities data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Severity Distribution</CardTitle>
          <CardDescription>for posts published within last month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex justify-center items-center h-[250px]">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
          <div className="flex justify-center mt-4 gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Severity Distribution</CardTitle>
          <CardDescription>for posts published within last month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Severity Distribution</CardTitle>
        <CardDescription>for posts published within last month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig1} className="mx-auto aspect-square max-h-[250px]">
          <RechartsPieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="posts" nameKey="label" innerRadius={60} />
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function PieChart2() {
  const [chartData, setChartData] = useState<PieChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchSentimentDistribution()
        setChartData(data)
      } catch (err) {
        setError("Failed to fetch sentiments data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Sentiment Distribution</CardTitle>
          <CardDescription>for posts published within last month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex justify-center items-center h-[250px]">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
          <div className="flex justify-center mt-4 gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Sentiment Distribution</CardTitle>
          <CardDescription>for posts published within last month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>for posts published within last month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig2} className="mx-auto aspect-square max-h-[250px]">
          <RechartsPieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="posts" nameKey="label" innerRadius={60} />
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

