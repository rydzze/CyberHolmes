import os
import sys
from pathlib import Path
from django.core.management.base import BaseCommand
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

class Command(BaseCommand):
    help = 'Run a Scrapy spider with parameters'
    
    def add_arguments(self, parser):
        parser.add_argument('spider_name', type=str)
        parser.add_argument('--keyword', type=str)

    def handle(self, *args, **options):
        BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
        CRAWLER_DIR = BASE_DIR / 'crawler'
        
        os.environ['SCRAPY_SETTINGS_MODULE'] = 'crawler.settings'
        sys.path.insert(0, str(CRAWLER_DIR))
        
        settings = get_project_settings()
        process = CrawlerProcess(settings)
        
        process.crawl(
            options['spider_name'],
            keyword=options.get('keyword')
        )
        process.start()