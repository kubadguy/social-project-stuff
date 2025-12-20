from django.urls import path
from . import views as vw

app_name = 'cont'

urlpatterns = [
    path('test/', vw.index, name='test-view'),
    path('ping-health/', vw.healthz, name='health-check'),
    path('is_alive/', vw.is_alive, name='is-alive'),
    path('wake-up/', vw.wake_up, name= 'wake-up')
]