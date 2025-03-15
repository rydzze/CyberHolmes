from django.db import models
from django.utils import timezone

class Spider(models.Model):
    spider_name = models.CharField(max_length=255)
    keyword = models.CharField(max_length=255, null=True)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True)
    status = models.CharField(max_length=20, default='running')

    class Meta:
        ordering = ['-start_time']

class Post(models.Model):
    spider = models.ForeignKey(Spider, on_delete=models.CASCADE)
    title = models.TextField()
    link = models.URLField(unique=True)
    content = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField()
    username = models.CharField(max_length=255)
    userlink = models.URLField()

    class Meta:
        ordering = ['-timestamp']