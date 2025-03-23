from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from main.models import Spider, Post
from api.serializers import SpiderSerializer, PostSerializer
from scrapy.crawler import CrawlerRunner
from scrapy.spiderloader import SpiderLoader
from scrapy.utils.project import get_project_settings
from django.db import close_old_connections
import logging
import crochet

crochet.setup()

from twisted.internet import reactor, defer
from scrapy.utils.log import configure_logging

logger = logging.getLogger(__name__)

class SpiderViewSet(viewsets.ModelViewSet):
    queryset = Spider.objects.all()
    serializer_class = SpiderSerializer
    permission_classes = [permissions.AllowAny]
    
    _active_crawlers = {}

    @action(detail=False, methods=['post'])
    def deploy_crawler(self, request):
        try:
            spider_name = request.data.get('spider_name', '')
            keyword = request.data.get('keyword', '')
            
            if not spider_name:
                return Response(
                    {'error': 'Missing required parameter: spider_name'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            settings = get_project_settings()
            settings.set('TWISTED_REACTOR', 'twisted.internet.selectreactor.SelectReactor')
            settings.set('LOG_ENABLED', True)
            settings.set('LOG_LEVEL', 'DEBUG')
            settings.set('LOG_STDOUT', True)
            configure_logging(settings)
            
            spider_loader = SpiderLoader(settings)
            available_spiders = spider_loader.list()

            if spider_name not in available_spiders:
                return Response(
                    {
                        'error': f'Spider "{spider_name}" not found',
                        'available_spiders': available_spiders
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            run_id = f"{spider_name}_{keyword}_{id(request)}"
            
            @crochet.run_in_reactor
            def deploy_crawler():
                """Run the spider and return a Deferred"""
                runner = CrawlerRunner(settings)
                deferred = runner.crawl(spider_name, keyword=keyword)
                
                self._active_crawlers[run_id] = runner
                
                def on_success(result):
                    logger.info(f"Spider {spider_name} completed successfully")
                    close_old_connections()

                    if run_id in self._active_crawlers:
                        del self._active_crawlers[run_id]
                    return result
                    
                def on_error(failure):
                    logger.error(f"Spider {spider_name} failed: {failure}")
                    close_old_connections()

                    if run_id in self._active_crawlers:
                        del self._active_crawlers[run_id]
                    return failure
                
                new_deferred = defer.Deferred()
                deferred.addCallbacks(
                    callback=lambda r: new_deferred.callback(on_success(r)),
                    errback=lambda f: new_deferred.errback(on_error(f))
                )
                
                reactor.callLater(600, lambda: new_deferred.cancel() if not new_deferred.called else None)
                
                return new_deferred

            try:
                _ = deploy_crawler()
                
                logger.info(f"Spider {spider_name} started with keyword: {keyword}")
                return Response({
                    'status': 'started',
                    'spider': spider_name,
                    'keyword': keyword,
                    'run_id': run_id,
                    'message': f'Spider {spider_name} started successfully'
                }, status=status.HTTP_202_ACCEPTED)
            except Exception as e:
                logger.error(f"Spider execution failed: {str(e)}")
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            logger.exception("API error occurred")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]