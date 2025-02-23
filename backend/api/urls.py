from django.urls import path
from .views import DashboardDataView

urlpatterns = [
    path('dashboard/', DashboardDataView.as_view(), name='dashboard-data'),
]