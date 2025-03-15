import scrapy

class Post(scrapy.Item):
    title = scrapy.Field()
    link = scrapy.Field()
    content = scrapy.Field()
    timestamp = scrapy.Field()
    username = scrapy.Field()
    userlink = scrapy.Field()
    spider_id = scrapy.Field()

class Spider(scrapy.Item):
    platform = scrapy.Field()
    keyword = scrapy.Field()
    start_time = scrapy.Field()
    end_time = scrapy.Field()
    status = scrapy.Field()