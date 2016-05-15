from django.conf.urls import url
from . import apiviews

urlpatterns = [
    url(r'projects/$', apiviews.ProjectList.as_view()),
    url(r'projects/(?P<project>[0-9]+)/$', apiviews.ProjectDetail.as_view()),
    url(r'projects/(?P<project>[0-9]+)/timeslips$', apiviews.TimeSlipList.as_view()),
    url(r'projects/(?P<project>[0-9]+)/invoices$', apiviews.InvoiceList.as_view()),
]
