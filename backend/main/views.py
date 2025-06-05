from django.db import close_old_connections
from django.db.models import Count, Case, When, IntegerField
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
import sys

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
        """
        Deploy a Scrapy spider asynchronously with required keyword filtering.

        Validates the requested spider source and keyword, configures settings, 
        and launches the spider using Twisted and Crochet. The crawl runs in 
        the background and times out after 10 minutes.

        Request Body:
            - source (str): Required. Name of the spider to run.
            - keyword (str): Required. Keyword to filter crawling.

        Returns:
            Response: JSON with crawl status, spider name, keyword, and run ID.
        """

        try:
            source = request.data.get('source', '')
            keyword = request.data.get('keyword', '')
            
            if not source:
                return Response(
                    {'error': 'Missing required parameter: source'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            settings = get_project_settings()
            if sys.platform == 'win32':
                settings.set('TWISTED_REACTOR', 'twisted.internet.selectreactor.SelectReactor')
            else:
                settings.set('TWISTED_REACTOR', 'twisted.internet.epollreactor.EPollReactor')
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
                """
                Launches a Scrapy spider asynchronously in the Twisted reactor.

                Initialises a CrawlerRunner with project settings, starts the crawl
                with the provided source and keyword, and registers callbacks for
                success and failure. Also enforces a 10-minute timeout.

                Returns:
                    Deferred: A Crochet-wrapped Twisted Deferred representing the crawl.
                """

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
        """
        Retrieve all post records along with their associated analysis data.

        Fetches all posts and prefetches their related spider and analysis objects to avoid
        additional database queries. The result includes post details as well as threat detection,
        sentiment, CVSS, and MITRE ATT&CK data if available.

        Returns:
            Response: A list of serialized posts with embedded analysis information.
        """

        posts = Post.objects.select_related('spider', 'analysis').all()
        serializer = PostWithAnalysisSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def posts_scraped_over_time(self, request):
        """
        Retrieve the number of posts scraped in each of the last 6 months.

        Groups post records by month over the last 6 months and counts how many were scraped in each month.

        Returns:
            Response: A list of dictionaries, each containing:
                - month (str): Name of the month.
                - post (int): Number of posts scraped during that month.
        """

        six_months_ago = timezone.now() - relativedelta(months=6)
        recent_posts = Post.objects.filter(timestamp__gte=six_months_ago).select_related('spider')
        current_date = timezone.now()
        result = []
        months = []

        for i in range(5, -1, -1):
            month_date = current_date - relativedelta(months=i)
            months.append((month_date.month, month_date.year, calendar.month_name[month_date.month]))
        
        for month_num, year, month_name in months:
            month_posts = recent_posts.filter(timestamp__month=month_num,timestamp__year=year)
            posts = month_posts.count()

            result.append({
                "month": month_name,
                "post": posts,
            })
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def posts_scraped_by_source(self, request):
        """
        Retrieve the number of posts scraped by source for each of the last 6 months.

        Filters posts from the last 6 months and groups them by both month and source
        ('Reddit', 'DarkNet Army', 'Best Carding World').

        Returns:
            Response: A list of dictionaries, each containing:
                - month (str): Name of the month.
                - reddit (int): Number of Reddit posts.
                - darknet_army (int): Number of DarkNet Army posts.
                - best_carding_world (int): Number of Best Carding World posts.
        """

        six_months_ago = timezone.now() - relativedelta(months=6)
        recent_posts = Post.objects.filter(timestamp__gte=six_months_ago).select_related('spider')
        current_date = timezone.now()
        result = []
        months = []

        sources = ['Reddit', 'DarkNet Army', 'Best Carding World']
        for i in range(5, -1, -1):
            month_date = current_date - relativedelta(months=i)
            months.append((month_date.month, month_date.year, calendar.month_name[month_date.month]))
        
        for month_num, year, month_name in months:
            month_data = {"month": month_name}
            month_posts = recent_posts.filter(timestamp__month=month_num, timestamp__year=year)
            
            for source in sources:
                source_key = source.lower().replace(' ', '_')
                count = month_posts.filter(spider__source=source).count()
                month_data[source_key] = count
            
            result.append(month_data)
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def threat_posts_by_source(self, request):
        """
        Retrieve a 6-month breakdown of threat-related posts grouped by source.

        Filters posts from the last 6 months that have been flagged as threats and groups them
        by month and by source ('Reddit', 'DarkNet Army', 'Best Carding World'). For each month,
        returns the count of threat posts per source.

        Returns:
            Response: A list of dictionaries, each containing:
                - month (str): Name of the month.
                - reddit (int): Count of Reddit threat posts.
                - darknet_army (int): Count of DarkNet Army threat posts.
                - best_carding_world (int): Count of Best Carding World threat posts.
        """
        
        six_months_ago = timezone.now() - relativedelta(months=6)
        recent_posts = Post.objects.filter(timestamp__gte=six_months_ago,analysis__threat=True).select_related('spider', 'analysis')
        current_date = timezone.now()
        result = []
        months = []

        sources = ['Reddit', 'DarkNet Army', 'Best Carding World']
        for i in range(5, -1, -1):
            month_date = current_date - relativedelta(months=i)
            months.append((month_date.month, month_date.year, calendar.month_name[month_date.month]))
        
        for month_num, year, month_name in months:
            month_data = {"month": month_name}
            month_posts = recent_posts.filter(timestamp__month=month_num, timestamp__year=year)
            
            for source in sources:
                source_key = source.lower().replace(' ', '_')
                count = month_posts.filter(spider__source=source).count()
                month_data[source_key] = count
            
            result.append(month_data)
        
        return Response(result)

    @action(detail=False, methods=['get'])
    def summary_stats(self, request):
        """
        Retrieve summary statistics for all posts and analyses.

        Returns the total number of posts, the number of posts flagged as threats,
        and the number of posts with a negative overall sentiment.

        Returns:
            Response: A dictionary containing:
                - total_posts (int): Total number of posts in the system.
                - total_threats (int): Total number of posts flagged as threats.
                - total_negative_sentiments (int): Total number of posts with negative sentiment.
        """

        total_posts = Post.objects.count()
        total_threats = Analysis.objects.filter(threat=True).count()
        total_negative_sentiments = Analysis.objects.filter(overall_sentiment='Negative').count()
        
        return Response({
            'total_posts': total_posts,
            'total_threats': total_threats,
            'total_negative_sentiments': total_negative_sentiments
        })

    @action(detail=False, methods=['get'])
    def top_keywords_clearweb(self, request):
        """
        Retrieve the top 5 most frequent keywords used in 'Reddit' posts over the past month.

        Filters posts from the last month where the spider source is 'Reddit', aggregates the associated
        spider keywords, and returns the top 5 keywords based on post count.

        Returns:
            Response: A list of dictionaries, each containing:
                - label (str): The keyword.
                - value (int): Number of posts associated with the keyword.
        """
        
        timeframe = timezone.now() - relativedelta(months=1)
        keyword_stats = Post.objects.filter(timestamp__gte=timeframe, spider__source='Reddit') \
                                    .values('spider__keyword') \
                                    .annotate(total=Count('id')) \
                                    .order_by('-total')[:5]
        
        return Response([
            {'label': item['spider__keyword'], 'value': item['total']} 
            for item in keyword_stats
        ])
    
    @action(detail=False, methods=['get'])
    def top_keywords_darkweb(self, request):
        """
        Retrieve the top 5 most frequent keywords used in dark web posts over the past month.

        Filters posts from the last 30 days where the spider source is either 'DarkNet Army' or
        'Best Carding World', aggregates the associated spider keywords, and returns the top 5
        keywords based on post count.

        Returns:
            Response: A list of dictionaries, each containing:
                - label (str): The keyword.
                - value (int): Number of posts associated with the keyword.
        """

        timeframe = timezone.now() - relativedelta(months=1)
        keyword_stats = Post.objects.filter(timestamp__gte=timeframe,
                                            spider__source__in=['DarkNet Army', 'Best Carding World']) \
                                    .values('spider__keyword') \
                                    .annotate(total=Count('id')) \
                                    .order_by('-total')[:5]
        
        return Response([
            {'label': item['spider__keyword'], 'value': item['total']} 
            for item in keyword_stats
        ])

    @action(detail=False, methods=['get'])
    def top_entities_clearweb(self, request):
        """
        Retrieve the top 5 most active entities (usernames) from the clear web source over the past month.

        Filters posts from the last months where the spider source is 'Reddit', counts the number of
        posts per username, and returns the top 5 ranked by post volume.

        Returns:
            Response: A list of dictionaries, each containing:
                - label (str): The username.
                - value (int): Number of posts associated with the username.
        """

        timeframe = timezone.now() - relativedelta(months=1)
        entity_stats = Post.objects.filter(timestamp__gte=timeframe, spider__source='Reddit') \
                                   .values('username') \
                                   .annotate(total=Count('id')) \
                                   .order_by('-total')[:5]
        
        return Response([
            {'label': item['username'], 'value': item['total']} 
            for item in entity_stats
        ])
    
    @action(detail=False, methods=['get'])
    def top_entities_darkweb(self, request):
        """
        Retrieve the top 5 most active entities (usernames) from dark web sources over the past month.

        Filters posts from the last 30 days where the spider source is either 'DarkNet Army' or
        'Best Carding World', counts the number of posts per username, and returns the top 5
        ranked by post volume.

        Returns:
            Response: A list of dictionaries, each containing:
                - label (str): The username.
                - value (int): Number of posts associated with the username.
        """

        timeframe = timezone.now() - relativedelta(months=1)
        entity_stats = Post.objects.filter(timestamp__gte=timeframe,
                                           spider__source__in=['DarkNet Army', 'Best Carding World']) \
                                   .values('username') \
                                   .annotate(total=Count('id')) \
                                   .order_by('-total')[:5]
        
        return Response([
            {'label': item['username'], 'value': item['total']} 
            for item in entity_stats
        ])

class AnalysisViewSet(viewsets.ModelViewSet):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def severity_distribution_clearweb(self, request):
        """
        Retrieve the distribution of CVSS severity ratings for posts from the 'Reddit' source over the past month.

        Filters posts from the last month where the spider source is 'Reddit'. Aggregates counts of related
        Analysis entries grouped by CVSS severity categories: Critical, High, Medium, Low, and None.

        Returns:
            Response: A JSON list of dictionaries, each containing:
                - label (str): Severity category (e.g., 'critical', 'high').
                - posts (int): Number of posts in that category.
                - fill (str): CSS variable string for UI color representation.
        """

        timeframe = timezone.now() - relativedelta(months=1)
        recent_post = Post.objects.filter(timestamp__gte=timeframe, spider__source='Reddit').values_list('id', flat=True)

        category_stats = Analysis.objects.filter(post_id__in=recent_post).aggregate(
            critical=Count(Case(When(cvss_rating='Critical', then=1), output_field=IntegerField())),
            high=Count(Case(When(cvss_rating='High', then=1), output_field=IntegerField())),
            medium=Count(Case(When(cvss_rating='Medium', then=1), output_field=IntegerField())),
            low=Count(Case(When(cvss_rating='Low', then=1), output_field=IntegerField())),
            none=Count(Case(When(cvss_rating='None', then=1), output_field=IntegerField()))
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
    def severity_distribution_darkweb(self, request):
        """
        Retrieve the distribution of CVSS severity ratings for posts from specific dark web sources over the past month.

        Filters posts from the last month where the spider source is either 'DarkNet Army'
        or 'Best Carding World'. Aggregates counts of related Analysis entries grouped
        by CVSS severity categories: Critical, High, Medium, Low, and None.

        Returns:
            Response: A JSON list of dictionaries, each containing:
                - label (str): Severity category (e.g., 'critical', 'high').
                - posts (int): Number of posts in that category.
                - fill (str): CSS variable string for UI color representation.
        """
        
        timeframe = timezone.now() - relativedelta(months=1)
        recent_post = Post.objects.filter(timestamp__gte=timeframe, spider__source__in=['DarkNet Army', 'Best Carding World']).values_list('id', flat=True)

        category_stats = Analysis.objects.filter(post_id__in=recent_post).aggregate(
            critical=Count(Case(When(cvss_rating='Critical', then=1), output_field=IntegerField())),
            high=Count(Case(When(cvss_rating='High', then=1), output_field=IntegerField())),
            medium=Count(Case(When(cvss_rating='Medium', then=1), output_field=IntegerField())),
            low=Count(Case(When(cvss_rating='Low', then=1), output_field=IntegerField())),
            none=Count(Case(When(cvss_rating='None', then=1), output_field=IntegerField()))
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