from django.db import close_old_connections
from django.db.models import Count, Case, When, IntegerField, Q
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from scrapy.crawler import CrawlerRunner
from scrapy.spiderloader import SpiderLoader
from scrapy.utils.project import get_project_settings
from dateutil.relativedelta import relativedelta
from .models import Spider, Post, Analysis
from .serializers import *
import calendar
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
            source = request.data.get('source', '')
            keyword = request.data.get('keyword', '')
            
            if not source:
                return Response(
                    {'error': 'Missing required parameter: source'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            settings = get_project_settings()
            settings.set('TWISTED_REACTOR', 'twisted.internet.selectreactor.SelectReactor')
            settings.set('LOG_ENABLED', True)
            settings.set('LOG_LEVEL', 'DEBUG')
            settings.set('LOG_STDOUT', True)
            configure_logging(settings)
            
            spider_loader = SpiderLoader(settings)
            available_sources = spider_loader.list()

            if source not in available_sources:
                return Response(
                    {
                        'error': f'Spider "{source}" not found',
                        'available_sources': available_sources
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            run_id = f"{source}_{keyword}_{id(request)}"
            
            @crochet.run_in_reactor
            def deploy_crawler():
                """Run the spider and return a Deferred"""
                runner = CrawlerRunner(settings)
                deferred = runner.crawl(source, keyword=keyword)
                
                self._active_crawlers[run_id] = runner
                
                def on_success(result):
                    logger.info(f"Spider {source} completed successfully")
                    close_old_connections()

                    if run_id in self._active_crawlers:
                        del self._active_crawlers[run_id]
                    return result
                    
                def on_error(failure):
                    logger.error(f"Spider {source} failed: {failure}")
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
                
                logger.info(f"Spider {source} started with keyword: {keyword}")
                return Response({
                    'status': 'started',
                    'spider': source,
                    'keyword': keyword,
                    'run_id': run_id,
                    'message': f'Spider {source} started successfully'
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

    @action(detail=False, methods=['get'])
    def analysis_records(self, request):
        posts = Post.objects.select_related('spider', 'analysis').all()
        serializer = PostWithAnalysisSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary_stats(self, request):
        total_posts = Post.objects.count()
        total_threats = Analysis.objects.filter(threat=True).count()
        total_negative_sentiments = Analysis.objects.filter(overall_sentiment='Negative').count()
        
        return Response({
            'total_posts': total_posts,
            'total_threats': total_threats,
            'total_negative_sentiments': total_negative_sentiments
        })

    @action(detail=False, methods=['get'])
    def top_keywords(self, request):
        timeframe = timezone.now() - relativedelta(months=1)
        keyword_stats = Post.objects.filter(timestamp__gte=timeframe) \
                                .values('spider__keyword') \
                                .annotate(total=Count('id')) \
                                .order_by('-total')[:5]
        
        return Response([
            {'label': item['spider__keyword'], 'value': item['total']} 
            for item in keyword_stats
        ])

    @action(detail=False, methods=['get'])
    def top_entities(self, request):
        timeframe = timezone.now() - relativedelta(months=1)
        entity_stats = Post.objects.filter(timestamp__gte=timeframe) \
                            .values('username') \
                            .annotate(total=Count('id')) \
                            .order_by('-total')[:5]
        
        return Response([
            {'label': item['username'], 'value': item['total']} 
            for item in entity_stats
        ])
    
    @action(detail=False, methods=['get'])
    def posts_over_time(self, request):
        six_months_ago = timezone.now() - relativedelta(months=6)
        clear_web = ['Reddit']
        dark_web = ['DarkNet Army', 'Best Carding World']
        
        recent_posts = Post.objects.filter(timestamp__gte=six_months_ago).select_related('spider')
        current_date = timezone.now()
        result = []
        months = []

        for i in range(5, -1, -1):
            month_date = current_date - relativedelta(months=i)
            months.append((month_date.month, month_date.year, calendar.month_name[month_date.month]))
        
        for month_num, year, month_name in months:
            month_posts = recent_posts.filter(
                timestamp__month=month_num,
                timestamp__year=year
            )
            
            clear_web_posts = month_posts.filter(spider__source__in=clear_web).count()
            dark_web_posts = month_posts.filter(spider__source__in=dark_web).count()
            result.append({
                "month": month_name,
                "clear_web": clear_web_posts,
                "dark_web": dark_web_posts
            })
        
        return Response(result)

class AnalysisViewSet(viewsets.ModelViewSet):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def posts_by_severity(self, request):
        timeframe = timezone.now() - relativedelta(months=1)
        recent_post = Post.objects.filter(timestamp__gte=timeframe).values_list('id', flat=True)

        category_stats = Analysis.objects.filter(post_id__in=recent_post).aggregate(
            critical=Count(Case(When(cvss_rating='Critical', then=1), output_field=IntegerField())),
            high=Count(Case(When(cvss_rating='High', then=1), output_field=IntegerField())),
            medium=Count(Case(When(cvss_rating='Medium', then=1), output_field=IntegerField())),
            low=Count(Case(When(cvss_rating='Low', then=1), output_field=IntegerField())),
            none=Count(Case(When(Q(cvss_rating__isnull=True) | Q(cvss_rating='None'), then=1), output_field=IntegerField()))
        )

        result = []        
        severity_labels = ['critical', 'high', 'medium', 'low', 'none']
        for item in severity_labels:
            result.append({
                "label": item,
                "posts": category_stats[item],
                "fill": f"var(--color-{item})"
            })

        return Response(result)
    
    @action(detail=False, methods=['get'])
    def posts_by_sentiment(self, request):
        timeframe = timezone.now() - relativedelta(months=1)
        recent_post = Post.objects.filter(timestamp__gte=timeframe).values_list('id', flat=True)
        
        sentiment_stats = Analysis.objects.filter(post_id__in=recent_post) \
                                         .values('overall_sentiment') \
                                         .annotate(total=Count('id'))
        
        result = []
        for item in sentiment_stats:
            sentiment = item['overall_sentiment']
            count = item['total']
            
            result.append({
                "label": sentiment.lower(),
                "posts": count,
                "fill": f"var(--color-{sentiment.lower()})"
            })
        
        return Response(result)