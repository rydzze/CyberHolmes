"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchSummaryStats} from "@/lib/api/dashboard"
import { SummaryStatsData } from "@/lib/types/dashboard"

export function SummaryStats() {
  const [summaryStatsData, setSummaryData] = useState<SummaryStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchSummaryStats()
        setSummaryData(data)
      } catch (err) {
        setError("Failed to fetch summary data. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 col-span-3">
        <Card className="flex flex-col items-center justify-center p-6 h-40">
          <Skeleton className="h-10 w-20 mb-3" />
          <Skeleton className="h-6 w-32" />
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 h-40">
          <Skeleton className="h-10 w-20 mb-3" />
          <Skeleton className="h-6 w-32" />
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 h-40">
          <Skeleton className="h-10 w-20 mb-3" />
          <Skeleton className="h-6 w-32" />
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="col-span-3">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const data = summaryStatsData || { total_posts: 0, total_threats: 0, total_negative_sentiments: 0 }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 col-span-3">
      <Card className="flex flex-col items-center justify-center p-6 h-40">
        <div className="text-3xl font-bold mb-3">{data.total_posts}</div>
        <h3 className="text-md font-medium text-center">Posts Scraped</h3>
      </Card>
      <Card className="flex flex-col items-center justify-center p-6 h-40">
        <div className="text-3xl text-red-700 dark:text-red-400 font-bold mb-3">{data.total_threats}</div>
        <h3 className="text-md font-medium text-center">Threats Detected</h3>
      </Card>
      <Card className="flex flex-col items-center justify-center p-6 h-40">
        <div className="text-3xl text-red-700 dark:text-red-400 font-bold mb-3">{data.total_negative_sentiments}</div>
        <h3 className="text-md font-medium text-center">Negative Sentiments</h3>
      </Card>
    </div>
  )
}

