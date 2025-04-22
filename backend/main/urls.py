from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpiderViewSet, PostViewSet, AnalysisViewSet

router = DefaultRouter()
router.register(r'spiders', SpiderViewSet)
router.register(r'posts', PostViewSet)
router.register(r'analyses', AnalysisViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/deploy_crawler/', SpiderViewSet.as_view({'post': 'deploy_crawler'}), name='deploy_crawler'),
    path('api/analysis_records/', PostViewSet.as_view({'get': 'analysis_records'}), name='analysis_records'),
    
    path('api/posts_scraped_over_time/', PostViewSet.as_view({'get': 'posts_scraped_over_time'}), name='posts_scraped_over_time'),
    path('api/posts_scraped_by_source/', PostViewSet.as_view({'get': 'posts_scraped_by_source'}), name='posts_scraped_by_source'),
    path('api/threat_posts_by_source/', PostViewSet.as_view({'get': 'threat_posts_by_source'}), name='threat_posts_by_source'),
    path('api/summary_stats/', PostViewSet.as_view({'get': 'summary_stats'}), name='summary_stats'),
    
    path('api/top_keywords_clearweb/', PostViewSet.as_view({'get': 'top_keywords_clearweb'}), name='top_keywords_clearweb'),
    path('api/top_entities_clearweb/', PostViewSet.as_view({'get': 'top_entities_clearweb'}), name='top_entities_clearweb'),
    path('api/severity_distribution_clearweb/', AnalysisViewSet.as_view({'get': 'severity_distribution_clearweb'}), name='severity_distribution_clearweb'),
    
    path('api/top_keywords_darkweb/', PostViewSet.as_view({'get': 'top_keywords_darkweb'}), name='top_keywords_darkweb'),
    path('api/top_entities_darkweb/', PostViewSet.as_view({'get': 'top_entities_darkweb'}), name='top_entities_darkweb'),
    path('api/severity_distribution_darkweb/', AnalysisViewSet.as_view({'get': 'severity_distribution_darkweb'}), name='severity_distribution_darkweb'),
]