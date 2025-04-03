import type { SummaryStatsData, BarChartData, PieChartData, LineChartData } from "@/lib/types/dashboard"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchSummaryStats(): Promise<SummaryStatsData> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary_stats`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching summary statistics data:", error)
    throw error
  }
}

export async function fetchTopKeywords(): Promise<BarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/top_keywords`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching top keywords data:", error)
    throw error
  }
}

export async function fetchTopEntities(): Promise<BarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/top_entities`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching top entities data:", error)
    throw error
  }
}

export async function fetchSeverityDistribution(): Promise<PieChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts_by_severity`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching severity distribution data:", error)
    throw error
  }
}

export async function fetchSentimentDistribution(): Promise<PieChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts_by_sentiment`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching sentiment distribution data:", error)
    throw error
  }
}

export async function fetchPostsOverTime(): Promise<LineChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts_over_time`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching posts over time data:", error)
    throw error
  }
}