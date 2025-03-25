import type { CrawlerRecord, DeployCrawlerParams } from "@/lib/types/crawler"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchAllCrawlerRecords(): Promise<CrawlerRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/spiders/`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching crawler records:", error)
      throw error
    }
  }
  
export async function deployCrawler(params: DeployCrawlerParams): Promise<CrawlerRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/deploy_crawler/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to deploy crawler" }))
      throw new Error(errorData.message || "Failed to deploy crawler")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error deploying crawler:", error)
    throw error
  }
}