from django.conf.urls import url
from . import apiviews

invoices = apiviews.InvoiceViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    url(r'projects/$', apiviews.ProjectList.as_view()),
    url(r'projects/(?P<pk>[0-9]+)/$', apiviews.ProjectDetail.as_view()),

    # url(r'projects/(?P<pk>[0-9]+)/invoices$', invoices, name='project-invoices'),
    url(r'invoices/$', invoices, name='project-invoices'),

    url(r'timeslips/$', apiviews.TimeSlipList.as_view()),
    url(r'timeslips/(?P<pk>[0-9]+)$', apiviews.TimeSlipDetail.as_view()),

    url(r'invoices/(?P<pk>[0-9]+)$', apiviews.InvoiceDetail.as_view())
]
