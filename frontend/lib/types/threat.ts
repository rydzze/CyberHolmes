export interface Threat {
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
    threat: string
    confidence: number
    overall_sentiment: string
    positive_score: number
    negative_score: number
    neutral_score: number
    compound_score: number
    post: number
  }
  isFlagged?: boolean // Added for UI state
}

