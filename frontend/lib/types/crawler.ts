export interface CrawlerRecord {
    id: number
    spider_name: string
    keyword: string
    start_time: string
    end_time: string | null
    status: string
}

export interface DeployCrawlerParams {
    spider_name: string
    keyword: string
}