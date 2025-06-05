from rest_framework import serializers
from .models import Spider, Post, Analysis

class SpiderSerializer(serializers.ModelSerializer):
    """
    Serializer for the Spider model.

    Serializes all fields of the Spider model, representing crawling sessions.
    """

    class Meta:
        model = Spider
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.

    Serializes all fields of the Post model, representing individual posts collected by a spider.
    """

    class Meta:
        model = Post
        fields = '__all__'

class AnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for the Analysis model.

    Serializes all fields of the Analysis model, which contains threat and sentiment analysis results.
    """

    class Meta:
        model = Analysis
        fields = '__all__'

class PostWithAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for Post model including related Analysis and spider source.

    - Includes the source field from the related Spider model.
    - Nested serialization of the related Analysis instance.
    """

    source = serializers.CharField(source='spider.source', read_only=True)
    analysis = AnalysisSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = '__all__'