import type { SummaryStatsData, HorizBarChartData, PieChartData, AreaChartData, VertBarChartData } from "@/lib/types/dashboard"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchPostsScrapedOverTime(): Promise<AreaChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts_scraped_over_time`)

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

export async function fetchPostsScrapedBySource(): Promise<VertBarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts_scraped_by_source`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching posts scraped by source data:", error)
    throw error
  }
}

export async function fetchThreatPostsBySource(): Promise<VertBarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/threat_posts_by_source`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching posts scraped by source data:", error)
    throw error
  }
}

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

export async function fetchTopKeywordsClearWeb(): Promise<HorizBarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/top_keywords_clearweb`)

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

export async function fetchTopKeywordsDarkWeb(): Promise<HorizBarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/top_keywords_darkweb`)

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

export async function fetchTopEntitiesClearWeb(): Promise<HorizBarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/top_entities_clearweb`)

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

export async function fetchTopEntitiesDarkWeb(): Promise<HorizBarChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/top_entities_darkweb`)

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

export async function fetchSeverityDistributionClearWeb(): Promise<PieChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/severity_distribution_clearweb`)

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

export async function fetchSeverityDistributionDarkWeb(): Promise<PieChartData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/severity_distribution_darkweb`)

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