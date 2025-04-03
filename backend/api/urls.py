from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpiderViewSet, PostViewSet, AnalysisViewSet

router = DefaultRouter()
router.register(r'spiders', SpiderViewSet)
router.register(r'posts', PostViewSet)
router.register(r'analyses', AnalysisViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('deploy_crawler/', SpiderViewSet.as_view({'post': 'deploy_crawler'}), name='deploy_crawler'),
    path('analysis_records/', PostViewSet.as_view({'get': 'analysis_records'}), name='analysis_records'),
    path('summary_stats/', PostViewSet.as_view({'get': 'summary_stats'}), name='summary_stats'),
    path('top_keywords/', PostViewSet.as_view({'get': 'top_keywords'}), name='top_keywords'),
    path('top_entities/', PostViewSet.as_view({'get': 'top_entities'}), name='top_entities'),
    path('posts_over_time/', PostViewSet.as_view({'get': 'posts_over_time'}), name='posts_over_time'),
    path('posts_by_severity/', AnalysisViewSet.as_view({'get': 'posts_by_severity'}), name='posts_by_severity'),
    path('posts_by_sentiment/', AnalysisViewSet.as_view({'get': 'posts_by_sentiment'}), name='posts_by_sentiment'),
]