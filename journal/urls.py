from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'projects/$', views.ProjectList.as_view()),

    url(r'projects/(?P<pk>[0-9]+)/$', views.ProjectDetail.as_view()),

    url(r'projects/(?P<project>[0-9]+)/timeslips$', views.TimeSlipList.as_view()),

    url(r'timeslips/', views.TimeSlipList.as_view()),
]
