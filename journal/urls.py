from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'thoughts/', views.ThoughtList.as_view()),
    url(r'tags/', views.TagList.as_view())
]
