from rest_framework import serializers
from main.models import Spider, Post

class SpiderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spider
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'