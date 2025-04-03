export interface SummaryStatsData {
  total_posts: number
  total_threats: number
  total_negative_sentiments: number
}

export interface BarChartData {
  label: string
  value: number
}

export interface PieChartData {
  label: string
  posts: number
  fill: string
}

export interface LineChartData {
  month: string
  clear_web: number
  dark_web: number
}