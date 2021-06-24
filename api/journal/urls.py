from django.conf.urls import url
from . import apiviews, views

urlpatterns = [
    url(r"api/projects/$", apiviews.ProjectList.as_view()),
    url(r"api/projects/summary/$", apiviews.ProjectSummary.as_view()),
    url(r"api/projects/(?P<pk>[0-9]+)$", apiviews.ProjectDetail.as_view()),
    url(r"api/invoices/$", apiviews.InvoiceListCreate.as_view()),
    url(r"api/timeslips/$", apiviews.TimeSlipList.as_view(), name="timeslips-list"),
    url(r"api/timeslips/(?P<pk>[0-9]+)$", apiviews.TimeSlipDetail.as_view()),
    url(r"api/invoices/(?P<pk>[0-9]+)$", apiviews.InvoiceDetail.as_view()),
    url(r"api/invoices/(?P<pk>[0-9]+)/pdf$", apiviews.InvoicePDF.as_view()),
    url(r"api/invoices/zip$", apiviews.BulkInvoicePDF.as_view()),
    url(
        r"api/invoices/(?P<pk>[0-9]+)/modifiers/(?P<modifier>[0-9]+)$",
        apiviews.InvoiceModifierDetail.as_view(),
    ),
    url(r"api/accounts/$", apiviews.AccountList.as_view()),
    url(r"api/tasks/$", apiviews.TaskList.as_view(), name="tasks-list"),
    url(r"api/tasks/(?P<pk>[0-9]+)$", apiviews.TaskDetail.as_view()),
    url(
        r"api/tasks/(?P<pk>[0-9]+)/summary$",
        apiviews.TaskSummary.as_view(),
        name="task-summary",
    ),
    url(r"api/contacts/$", apiviews.ContactList.as_view()),
    url(r"api/contacts/(?P<pk>[0-9]+)$", apiviews.ContactDetail.as_view()),
    url(r"api/modifiers/$", apiviews.InvoiceModifierList.as_view()),
    url(r"api/companies/$", apiviews.CompanyList.as_view()),
    url(r"api/companies/(?P<pk>[0-9]+)$", apiviews.CompanyDetail.as_view()),
    url(r"api/version/$", apiviews.VersionView.as_view()),
    url(r"api/logout/$", views.logout_user),
    # App Routing
    url(r"^$", views.landing),
    url(r"^", views.landing),
]
