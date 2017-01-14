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
    url(
        r'api/invoices/(?P<pk>[0-9]+)/modifiers$',
        apiviews.InvoiceModifiers.as_view()
    ),
    url(r'api/invoices/items/$', apiviews.InvoiceItems.as_view()),
    url(r'api/invoices/items/(?P<pk>[0-9]+)$', apiviews.InvoiceItem.as_view()),

    url(r'api/expenses/$', apiviews.ExpenseList.as_view()),

    url(r'api/accounts/$', apiviews.AccountList.as_view()),
    url(r'api/user/$', apiviews.UserDetail.as_view()),
    url(r'api/activity/$', apiviews.ActivityFeedList.as_view()),

    url(r'api/tasks/$', apiviews.TaskList.as_view()),

    url(r'api/version/$', apiviews.Version.as_view()),

    url(r'api/summary/invoices/$', apiviews.SummaryInvoices.as_view()),
    url(r'api/summary/expenses/$', apiviews.SummaryExpenses.as_view()),

    # App Routing
    url(r'monzo/$', views.monzo_webhook),
    url(r'login/$', views.login_user),
    url(r'logout/$', views.logout_user),
    url(r'^$', views.landing),
    url(r'^', views.landing)
]
