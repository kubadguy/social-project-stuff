from django.urls import path
from . import views as vw

app_name = 'cont'

urlpatterns = [
    path('test/', vw.index, name='test-view'),
    path('ping-health/', vw.healthz, name='health-check'),
]