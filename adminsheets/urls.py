from django.conf.urls import url
from adminsheets import views

urlpatterns = [
    url(r'(?P<path>.+)', views.sheet),
    url(r'^$', views.landing),
]
