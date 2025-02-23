from django.db import models

class DashboardData(models.Model):
    total_users = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    revenue = models.DecimalField(max_digits=10, decimal_places=2)