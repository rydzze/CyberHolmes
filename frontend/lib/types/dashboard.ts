export interface SummaryStatsData {
  total_posts: number
  total_threats: number
  total_negative_sentiments: number
}

export interface AreaChartData {
  month: string
  post: number
}

export interface HorizBarChartData {
  label: string
  value: number
}

export interface PieChartData {
  label: string
  posts: number
  fill: string
}

export interface VertBarChartData {
  month: string
  reddit: number
  darknet_army: number
  best_carding_world: number
}