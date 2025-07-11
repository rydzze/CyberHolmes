import scrapy
from requests_tor import RequestsTor
from scrapy.selector import Selector
from urllib.parse import quote_plus
from crawler.items import Post
from scrapy import signals

class DNASpider(scrapy.Spider):
    """
    A Scrapy Spider designed for crawling posts on DarkNet Army forum using TOR.
    
    This spider searches for posts based on a provided keyword, navigates the website via TOR,
    and extracts post details such as title, content, timestamp, and author information.
    """

    name = "DarkNet Army"

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
        spider = super(DNASpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        self.logger.info("Spider closed: %s", spider.name)

    def start_requests(self):
        encoded_keyword = quote_plus(self.keyword)
        self.base_url = 'http://darknet77vonbqeatfsnawm5jtnoci5z22mxay6cizmoucgmz52mwyad.onion/'
        self.target_url = f'{self.base_url}search/1337/?q={encoded_keyword}&t=post&o=date&g=1'
        
        yield scrapy.Request("https://check.torproject.org", callback=self.parse)
    
    def parse(self, response):
        """
        Parse the initial TOR check response and initiate crawling of the target darknet site.

        This method sets up a RequestsTor session to query the darknet target URL,
        extracts post links, and iteratively processes each post via the parse_post method.

        Args:
            response: The response from the initial TOR check page.

        Yields:
            scrapy.Request: Requests to parse individual posts.
            Final request to end the spider via the end() method.
        """

        self.logger.info(f"Starting request with URL: {self.target_url}")
        self.tor_session = RequestsTor(tor_ports=(9050,), tor_cport=9051)
        tor_response = self.tor_session.get(self.target_url)
        
        self.logger.info(f"Parsing posts in page: {self.target_url}")
        selector = Selector(text=tor_response.text)
        hrefs = selector.css('div.contentRow-main h3.contentRow-title a::attr(href)').extract()
        links = [self.base_url + href.lstrip('./') for href in hrefs]

        for link in links:
            tor_response_post = self.tor_session.get(link)
            if tor_response_post.ok and link not in self.seen_links:
                self.seen_links.add(link)
                selector = Selector(text=tor_response_post.text)
                yield from self.parse_post(link, selector)
        
        yield scrapy.Request("https://www.torproject.org/", callback=self.end)

    def parse_post(self, post_link, selector):
        """
        Extract detailed information from an individual darknet post.

        This method retrieves fields like title, content, timestamp, and user details,
        stores them into a Post item, and yields the item for storage.

        Args:
            post_link (str): The URL of the individual post.
            selector (Selector): A Scrapy selector built from the post page's HTML.

        Yields:
            Post: The populated post item.
        """
        
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
    
    def end(self, response):
        yield None