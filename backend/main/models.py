from django.db import models
from django.utils import timezone

class Spider(models.Model):
    source = models.CharField(max_length=255)
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

class Analysis(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='analysis')
    threat = models.BooleanField(null=True, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    overall_sentiment = models.TextField(null=True, blank=True)
    positive_score = models.FloatField(null=True, blank=True)
    negative_score = models.FloatField(null=True, blank=True)
    neutral_score = models.FloatField(null=True, blank=True)
    compound_score = models.FloatField(null=True, blank=True)
    cvss_vector = models.TextField(null=True, blank=True)
    cvss_base_score = models.FloatField(null=True, blank=True)
    cvss_rating = models.TextField(null=True, blank=True)
    mitre_attack_techniques = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-post__id']