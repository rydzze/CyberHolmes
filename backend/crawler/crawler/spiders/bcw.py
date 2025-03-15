import scrapy
from requests_tor import RequestsTor
from scrapy.selector import Selector
from urllib.parse import quote_plus
from crawler.items import Post

class BCWSpider(scrapy.Spider):
    name = "BCW"

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
        self.base_url = 'http://bestteermb42clir6ux7xm76d4jjodh3fpahjqgbddbmfrgp4skg2wqd.onion/'
        self.full_url = self.base_url + f'search.php?keywords={encoded_keyword}&terms=all&author=&sc=1&sf=all&sr=topics&sk=t&sd=d&st=0&ch=-1&t=0&submit=Search'
        
        yield scrapy.Request("https://check.torproject.org", callback=self.parse)

    def parse(self, response):
        while True:
            self.logger.info(f"Starting request with URL: {self.full_url}")
            self.tor_session = RequestsTor(tor_ports=(9050,), tor_cport=9051)
            tor_response = self.tor_session.get(self.full_url)
            
            self.logger.info(f"Parsing posts in page: {self.full_url}")
            selector = Selector(text=tor_response.text)
            hrefs = selector.css('a.topictitle::attr(href)').extract()
            links = [self.base_url + href.lstrip('./') for href in hrefs]
            
            for link in links:
                tor_response_post = self.tor_session.get(link)
                if tor_response_post.ok and link not in self.seen_links:
                    self.seen_links.add(link)
                    selector = Selector(text=tor_response_post.text)
                    self.parse_post(link, selector)
            
            next_page = selector.css('li.next a::attr(href)').get()
            if next_page is not None:
                self.full_url = self.base_url + next_page.lstrip('./')
                self.logger.info(f"Next page link detected: {self.full_url}. Proceeding to next page.")
            else:
                self.logger.info("No more pages available. Stopping spider.")
                break

    def parse_post(self, post_link, selector):
        self.logger.info(f"Processing post: {post_link}")

        try:
            post_title = selector.css('h2.topic-title a::text').get()
            post_content = selector.xpath('(//div[@class="content"])[1]//text()').getall()
            post_timestamp = selector.xpath('//p[@class="author"]/text()[last()]').get()
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