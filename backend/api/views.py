from rest_framework.views import APIView
from rest_framework.response import Response
from .models import DashboardData
from .serializers import DashboardDataSerializer

class DashboardDataView(APIView):
    def get(self, request):
        data = DashboardData.objects.last()
        serializer = DashboardDataSerializer(data)
        return Response(serializer.data)