import scrapy
from requests_tor import RequestsTor
from scrapy.selector import Selector
from urllib.parse import quote_plus
from crawler.items import Post
from datetime import datetime, timezone
from scrapy import signals

class BCWSpider(scrapy.Spider):
    """
    A Scrapy Spider designed for crawling posts on Best Carding World forum using TOR.

    This spider performs a search based on a provided keyword, navigates paginated 
    search result pages, and processes individual posts to extract details such as 
    title, content, timestamp, and user information.
    """

    name = "Best Carding World"

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
        spider = super(BCWSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        self.logger.info("Spider closed: %s", spider.name)

    def start_requests(self):
        encoded_keyword = quote_plus(self.keyword)
        self.base_url = 'http://bestteermb42clir6ux7xm76d4jjodh3fpahjqgbddbmfrgp4skg2wqd.onion/'
        self.target_url = f'{self.base_url}search.php?keywords={encoded_keyword}&terms=all&author=&sc=1&sf=all&sr=topics&sk=t&sd=d&st=0&ch=-1&t=0&submit=Search'
        
        yield scrapy.Request("https://check.torproject.org", callback=self.parse)

    def parse(self, response):
        """
        Parse the TOR check response and crawl the target search page.
        
        This method creates a TOR session using RequestsTor to fetch the target URL.
        It extracts post links from the search results, processes each post using
        `parse_post()`, and handles pagination by updating the target URL until 
        no additional pages are detected.
        
        Args:
            response: The response from the TOR check page.
        
        Yields:
            scrapy.Request objects for individual posts via `parse_post()`.
            Final request to trigger the end() callback when pagination ends.
        """
        
        while True:
            self.logger.info(f"Starting request with URL: {self.target_url}")
            self.tor_session = RequestsTor(tor_ports=(9050,), tor_cport=9051)
            tor_response = self.tor_session.get(self.target_url)
            
            self.logger.info(f"Parsing posts in page: {self.target_url}")
            selector = Selector(text=tor_response.text)
            hrefs = selector.css('a.topictitle::attr(href)').extract()
            links = [self.base_url + href.lstrip('./') for href in hrefs]
            
            for link in links:
                tor_response_post = self.tor_session.get(link)
                if tor_response_post.ok and link not in self.seen_links:
                    self.seen_links.add(link)
                    selector = Selector(text=tor_response_post.text)
                    yield from self.parse_post(link, selector)
            
            next_page = selector.css('li.next a::attr(href)').get()
            if next_page is not None:
                self.target_url = self.base_url + next_page.lstrip('./')
                self.logger.info(f"Next page link detected: {self.target_url}. Proceeding to next page.")
            else:
                self.logger.info("No more pages available. Stopping spider.")
                break
        
        yield scrapy.Request("https://www.torproject.org/", callback=self.end)

    def parse_post(self, post_link, selector):
        """
        Parse an individual post page and extract details.
        
        Extracts information such as the post title, content, timestamp, author name,
        and author profile link. It also converts the timestamp string into an ISO
        formatted date with UTC timezone.
        
        Args:
            post_link (str): The URL of the post.
            selector (Selector): Scrapy selector containing the HTML of the post page.
        
        Yields:
            Post: A populated Post item with the extracted fields.
        """

        self.logger.info(f"Processing post: {post_link}")

        try:
            post_title = selector.css('h2.topic-title a::text').get()
            post_content = selector.xpath('(//div[@class="content"])[1]//text()').getall()
            temp = selector.xpath('//p[@class="author"]/text()[last()]').get()
            date_obj = datetime.strptime(temp, "%a %b %d, %Y %I:%M %p ")
            post_timestamp = date_obj.replace(tzinfo=timezone.utc).isoformat()
            user_name = selector.css('a.username-coloured::text').get()
            user_link = selector.css('a.username-coloured::attr(href)').get()

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
            self.logger.error(f"Error processing post {post_link}: {str(e)}")

    def end(self, response):
        yield None