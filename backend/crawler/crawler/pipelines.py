import os
import django
import logging
from django.utils import timezone
from django.db import close_old_connections
from main.models import Spider, Post

logger = logging.getLogger(__name__)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

class DjangoSpiderPipeline:
    """
    Pipeline class to manage the lifecycle of a spider run with Django integration.

    This class handles the creation and finalisation of spider run records
    in the database using the Spider model.
    """

    def __init__(self):
        """
        Initialize the pipeline and prepare to track the spider run.
        """
        self.spider_run = None

    def open_spider(self, spider):
        """
        Called when the spider is opened.

        Creates a new Spider record in the database and attaches it to the spider instance.
        
        Args:
            spider: The spider instance that is starting its run.
        """

        self.spider_run = Spider.objects.create(
            source=spider.name,
            keyword=getattr(spider, 'keyword', None),
            status='running'
        )
        spider.spider_run = self.spider_run
        logger.info(f"Spider run started: {self.spider_run.id}")

    def close_spider(self, spider):
        """
        Called when the spider is closed.

        Updates the Spider record with an end time and status, then saves it to the database.
        Closes any old database connections.
        
        Args:
            spider: The spider instance that is ending its run.
        """

        try:
            self.spider_run.end_time = timezone.now()
            self.spider_run.status = 'completed'
            self.spider_run.save()
            logger.info(f"Spider run completed: {self.spider_run.id}")
        except Exception as e:
            logger.error(f"Error closing spider: {str(e)}")
        finally:
            close_old_connections()

class DjangoPostPipeline:
    """
    Pipeline class responsible for processing and saving posts scraped by the spider.

    This class uses the Post Django model to store each post if it does not already exist.
    """

    def process_item(self, item, spider):
        """
        Process each item (post) retrieved by the spider.

        Checks for duplicates via the 'link' and either retrieves an existing record or
        creates a new one. Any errors during saving are logged, and database connections are closed.
        
        Args:
            item (dict): A dictionary containing post data such as link, title, content, timestamp, username, and userlink.
            spider: The spider instance, which holds the reference to its spider_run.
            
        Returns:
            dict: The processed item.
        """
        
        try:
            Post.objects.get_or_create(
                link=item['link'],
                defaults={
                    'spider': spider.spider_run,
                    'title': item.get('title'),
                    'content': item.get('content'),
                    'timestamp': item.get('timestamp'),
                    'username': item.get('username'),
                    'userlink': item.get('userlink'),
                }
            )
            logger.debug(f"Post saved: {item.get('title')}")
        except Exception as e:
            logger.error(f"Error saving post: {str(e)}")
        finally:
            close_old_connections()

        return item