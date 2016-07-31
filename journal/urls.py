from django.conf.urls import url
from . import apiviews, views

invoices = apiviews.InvoiceViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    url(r'api/projects/$', apiviews.ProjectList.as_view()),
    url(r'api/projects/(?P<pk>[0-9]+)/$', apiviews.ProjectDetail.as_view()),

    url(r'api/invoices/$', invoices, name='project-invoices'),

    url(r'api/timeslips/$', apiviews.TimeSlipList.as_view()),
    url(r'api/timeslips/(?P<pk>[0-9]+)$', apiviews.TimeSlipDetail.as_view()),

    url(r'api/invoices/(?P<pk>[0-9]+)$', apiviews.InvoiceDetail.as_view()),
    url(r'api/invoices/(?P<pk>[0-9]+)/pdf$', apiviews.InvoicePDF.as_view()),
    url(r'api/invoices/(?P<pk>[0-9]+)/item$', apiviews.InvoiceItem.as_view()),

    url(r'api/accounts/$', apiviews.AccountList.as_view()),

    # App Routing
    url(r'login/$', views.login_user),
    url(r'^$', views.landing),
    url(r'^', views.landing)
]
