from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'projects/', views.ProjectList.as_view()),
    url(r'timeslips/', views.TimeSlipList.as_view()),
]
