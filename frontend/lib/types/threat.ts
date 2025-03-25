export interface Threat {
  id: number
  title: string
  link: string
  content: string
  timestamp: string
  username: string
  userlink: string
  threat: string
  confidence: number
  spider: number
}
  
export interface ApiResponse {
  data: Threat[]
  total: number
  page: number
  limit: number
}
  