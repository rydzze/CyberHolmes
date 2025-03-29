from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpiderViewSet, PostViewSet, AnalysisViewSet

router = DefaultRouter()
router.register(r'spiders', SpiderViewSet, basename='spider')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'analyses', AnalysisViewSet, basename='analysis')

urlpatterns = [
    path('', include(router.urls)),
    path('deploy_crawler/', SpiderViewSet.as_view({'post': 'deploy_crawler'}), name='deploy_crawler'),
    path('analysis_records/', PostViewSet.as_view({'get': 'analysis_records'}), name='analysis_records')
]