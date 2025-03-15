import os
import django
import logging
from datetime import datetime
from django.db import close_old_connections
from asgiref.sync import sync_to_async
from main.models import Spider, Post

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

logger = logging.getLogger(__name__)

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
        self.spider_run.end_time = datetime.now()
        self.spider_run.status = 'completed'
        self.spider_run.save()
        close_old_connections()

class DjangoPostPipeline:
    async def process_item(self, item, spider):
        try:
            await sync_to_async(self.save_post)(item, spider)
        except Exception as e:
            logger.error(f"Error saving post: {str(e)}")
        return item

    def save_post(self, item, spider):
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
        close_old_connections()