export interface Post {
  id: number
  title: string
  link: string
  content: string
  timestamp: string
  username: string
  userlink: string
  source: string
  spider: number
  analysis?: {
    id: number
    threat: boolean
    confidence: number
    overall_sentiment: string
    positive_score: number
    negative_score: number
    neutral_score: number
    compound_score: number
    cvss_vector?: string
    cvss_base_score?: number
    cvss_rating?: string
    mitre_attack_techniques?: string
    post: number
  }
}

