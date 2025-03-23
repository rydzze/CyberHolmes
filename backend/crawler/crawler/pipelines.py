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
    def __init__(self):
        self.spider_run = None

    def open_spider(self, spider):
        self.spider_run = Spider.objects.create(
            spider_name=spider.name,
            keyword=getattr(spider, 'keyword', None),
            status='running'
        )
        spider.spider_run = self.spider_run
        logger.info(f"Spider run started: {self.spider_run.id}")

    def close_spider(self, spider):
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
    def process_item(self, item, spider):
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