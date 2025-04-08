from rest_framework import serializers
from .models import Spider, Post, Analysis

class SpiderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spider
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = '__all__'

class PostWithAnalysisSerializer(serializers.ModelSerializer):
    source = serializers.CharField(source='spider.source', read_only=True)
    analysis = AnalysisSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = '__all__'