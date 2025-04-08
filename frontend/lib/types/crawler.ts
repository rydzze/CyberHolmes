export interface CrawlerRecord {
    id: number
    source: string
    keyword: string
    start_time: string
    end_time: string | null
    status: string
}

export interface DeployCrawlerParams {
    source: string
    keyword: string
}