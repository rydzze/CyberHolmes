"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchPostsScrapedBySource, fetchThreatPostsBySource } from "@/lib/api/dashboard"
import { VertBarChartData } from "@/lib/types/dashboard"

const chartConfig = {
  reddit: {
    label: "Reddit",
    color: "hsl(var(--reddit))",
  },
  darknet_army: {
    label: "DarkNet Army",
    color: "hsl(var(--darknet_army))",
  },
  best_carding_world: {
    label: "Best Carding World",
    color: "hsl(var(--best_carding_world))",
  },
} satisfies ChartConfig

export function PostScrapedBySource() {
  const [chartData, setChartData] = useState<VertBarChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchPostsScrapedBySource()
        setChartData(data)
      } catch (err) {
        setError("Failed to fetch posts scraped by source data")
        console.error(err)
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
          <CardTitle>Posts Scraped by Source</CardTitle>
          <CardDescription>within the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error && chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts Scraped by Source</CardTitle>
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
        <CardTitle>Posts Scraped by Source</CardTitle>
        <CardDescription>within the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="reddit" fill="var(--color-reddit)" radius={4} />
            <Bar dataKey="darknet_army" fill="var(--color-darknet_army)" radius={4} />
            <Bar dataKey="best_carding_world" fill="var(--color-best_carding_world)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ThreatPostsBySource() {
  const [chartData, setChartData] = useState<VertBarChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchThreatPostsBySource()
        setChartData(data)
      } catch (err) {
        setError("Failed to fetch threat posts by source data")
        console.error(err)
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
          <CardTitle>Threat Posts by Source</CardTitle>
          <CardDescription>within the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error && chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Threat Posts by Source</CardTitle>
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
        <CardTitle>Threat Posts by Source</CardTitle>
        <CardDescription>within the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="reddit" fill="var(--color-reddit)" radius={4} />
            <Bar dataKey="darknet_army" fill="var(--color-darknet_army)" radius={4} />
            <Bar dataKey="best_carding_world" fill="var(--color-best_carding_world)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
