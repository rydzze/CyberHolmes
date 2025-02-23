from rest_framework import serializers
from .models import DashboardData

class DashboardDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardData
        fields = '__all__'