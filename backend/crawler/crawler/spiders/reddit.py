import scrapy
from urllib.parse import quote_plus
from crawler.items import Post
from scrapy import signals

class RedditSpider(scrapy.Spider):
    name = 'Reddit'

    def __init__(self, keyword=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not keyword:
            self.logger.error("Initialisation failed: No keyword provided.")
            raise ValueError("No keyword provided.")
        self.keyword = keyword
        self.seen_links = set()
        self.logger.info(f"Initialised spider with keyword: '{self.keyword}'")

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(RedditSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        self.logger.info("Spider closed: %s", spider.name)

    def start_requests(self):
        encoded_keyword = quote_plus(self.keyword)
        url = f'https://old.reddit.com/search/?q={encoded_keyword}&sort=new&restrict_sr=&t=hour'
        
        self.logger.info(f"Starting request with URL: {url}")
        yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        self.logger.info(f"Parsing posts in page: {response.url}")
        links = response.css('div.search-result-group a::attr(href)')
        
        for link in links:
            post_link = response.urljoin(link.get())
            if (post_link.startswith('https://old.reddit.com/r/') and
                'comment' in post_link and post_link not in self.seen_links):
                self.seen_links.add(post_link)
                yield scrapy.Request(post_link, callback=self.parse_post, meta={'post_link': post_link})

        next_page = response.css('a[rel="nofollow next"]::attr(href)').getall()
        if next_page:
            next_page_link = next_page[-1]
            self.logger.info(f"Next page link detected: {next_page_link}. Proceeding to next page.")
            yield response.follow(next_page_link, callback=self.parse)
        else:
            self.logger.info("No more pages available. Stopping spider.")

    def parse_post(self, response):
        post_link = response.meta.get('post_link')
        self.logger.info(f"Processing post: {post_link}")

        try:
            post_title = response.css('a.title.may-blank::text').get()
            post_content = response.css('div.expando div.md p::text').extract()
            post_timestamp = response.css('time::attr(datetime)').get()
            user_name = response.css('p.tagline a.author::text').get()
            user_link = response.css('p.tagline a.author::attr(href)').get()

            item = Post()
            item['title'] = post_title.strip() if post_title else None
            item['link'] = post_link
            item['content'] = ' '.join(post_content).strip() if post_content else None
            item['timestamp'] = post_timestamp.strip() if post_timestamp else None
            item['username'] = user_name.strip() if user_name else None
            item['userlink'] = response.urljoin(user_link) if user_link else None
            
            self.logger.info(f"Successfully processed post: {post_link}")
            yield item

        except Exception as e:
            self.logger.error(f"Error processing post {response.url}: {str(e)}")