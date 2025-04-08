import type { Post } from "@/lib/types/post"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchAllPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis_records/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

