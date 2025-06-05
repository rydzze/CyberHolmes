from django.db import models
from django.utils import timezone

class Spider(models.Model):
    """
    Represents a web crawling session that collects posts from a specific source.

    Attributes:
        source (str): Name or identifier of the data source.
        keyword (str or None): Optional keyword used during crawling.
        start_time (datetime): Timestamp when the crawl started.
        end_time (datetime or None): Timestamp when the crawl ended.
        status (str): Current status of the crawl (e.g., 'running', 'completed').
    
    Meta:
        Orders by start_time descending (most recent first).
    """

    source = models.CharField(max_length=255)
    keyword = models.CharField(max_length=255, null=True)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True)
    status = models.CharField(max_length=20, default='running')

    class Meta:
        ordering = ['-start_time']

class Post(models.Model):
    """
    Represents an individual post or content item retrieved by a spider.

    Attributes:
        spider (ForeignKey): Reference to the Spider instance that collected this post.
        title (str): Title of the post.
        link (str): Unique URL link to the post.
        content (str or None): Optional full content of the post.
        timestamp (datetime): Date and time the post was published.
        username (str): Name of the user who created the post.
        userlink (str): URL to the user's profile or page.
    
    Meta:
        Orders by timestamp descending (most recent first).
    """

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
    """
    Stores analysis results related to a Post, including threat detection, sentiment, CVSS, and MITRE ATT&CK data.

    Attributes:
        post (OneToOneField): The post this analysis relates to.
        threat (bool or None): Whether the post is classified as a threat.
        confidence (float or None): Confidence score of the threat prediction.
        overall_sentiment (str or None): Overall sentiment label (e.g., 'Positive', 'Negative', 'Neutral').
        positive_score (float or None): Positive sentiment score.
        negative_score (float or None): Negative sentiment score.
        neutral_score (float or None): Neutral sentiment score.
        compound_score (float or None): Compound sentiment score.
        cvss_vector (str or None): CVSS v4 vector string.
        cvss_base_score (float or None): CVSS base score.
        cvss_rating (str or None): CVSS severity rating (e.g., 'Low', 'Medium', 'High').
        mitre_attack_techniques (JSON or None): JSON data of matched MITRE ATT&CK techniques.
    
    Meta:
        Orders by related post ID descending.
    """
    
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