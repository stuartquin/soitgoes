from django.conf.urls import url
from adminsheets import views, api

urlpatterns = [
    url(r'^$', views.landing),

    url(r'api/(?P<path>.+)fields/$', api.fields),
    url(r'(?P<path>.+)', views.sheet),
]
