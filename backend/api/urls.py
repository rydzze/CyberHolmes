from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpiderViewSet, PostViewSet

router = DefaultRouter()
router.register(r'spiders', SpiderViewSet, basename='spider')
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
    path('', include(router.urls)),
]