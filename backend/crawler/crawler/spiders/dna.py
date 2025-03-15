import scrapy
from requests_tor import RequestsTor
from scrapy.selector import Selector
from urllib.parse import quote_plus
from crawler.items import Post

class DNASpider(scrapy.Spider):
    name = "DNA"

    def __init__(self, keyword=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not keyword:
            self.logger.error("Initialisation failed: No keyword provided.")
            raise ValueError("No keyword provided.")
        self.keyword = keyword
        self.seen_links = set()
        self.logger.info(f"Initialised spider with keyword: '{self.keyword}'")

    def start_requests(self):
        encoded_keyword = quote_plus(self.keyword)
        self.base_url = 'http://darknet77vonbqeatfsnawm5jtnoci5z22mxay6cizmoucgmz52mwyad.onion/'
        self.target_url = self.base_url + f'search/1337/?q={encoded_keyword}&t=post&o=date&g=1'
        
        yield scrapy.Request("https://check.torproject.org", callback=self.parse)
    
    def parse(self, response):
        self.logger.info(f"Starting request with URL: {self.full_url}")
        self.tor_session = RequestsTor(tor_ports=(9050,), tor_cport=9051)
        tor_response = self.tor_session.get(self.target_url)
        
        self.logger.info(f"Parsing posts in page: {self.full_url}")
        selector = Selector(text=tor_response.text)
        hrefs = selector.css('div.contentRow-main h3.contentRow-title a::attr(href)').extract()
        links = [self.base_url + href.lstrip('./') for href in hrefs]

        for link in links:
            tor_response_post = self.tor_session.get(link)
            if tor_response_post.ok and link not in self.seen_links:
                self.seen_links.add(link)
                selector = Selector(text=tor_response_post.text)
                self.parse_post(link, selector)

    def parse_post(self, post_link, selector):
        self.logger.info(f"Processing post: {post_link}")

        try:
            post_title = selector.css('div.p-title h1.p-title-value::text').get()
            post_content = selector.xpath('(//div[@class="bbWrapper"])[1]//text()').getall()
            post_timestamp = selector.css('time.u-dt::attr(datetime)').get()
            user_name = selector.css('a.username::text').get()
            user_link = selector.css('a.username::attr(href)').get()

            item = Post()
            item['title'] = post_title if post_title else None
            item['link'] = post_link
            item['content'] = ' '.join(post_content).strip() if post_content else None
            item['timestamp'] = post_timestamp.strip() if post_timestamp else None
            item['username'] = user_name.strip() if user_name else None
            item['userlink'] = self.base_url + user_link.lstrip('./') if user_link else None
            
            self.logger.info(f"Successfully processed post: {post_link}")
            yield item

        except Exception as e:
            self.log(f"Error while processing link {post_link}: {str(e)}")