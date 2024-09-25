from django.urls import path
from . import apiviews, views

urlpatterns = [
    path(r"api/projects/", apiviews.ProjectList.as_view()),
    path(r"api/projects/summary/", apiviews.ProjectSummary.as_view()),
    path(r"api/projects/<int:pk>", apiviews.ProjectDetail.as_view()),
    path(r"api/invoices/", apiviews.InvoiceListCreate.as_view()),
    path(r"api/timeslips/", apiviews.TimeSlipList.as_view(), name="timeslips-list"),
    path(r"api/timeslips/<int:pk>", apiviews.TimeSlipDetail.as_view()),
    path(r"api/invoices/<int:pk>", apiviews.InvoiceDetail.as_view()),
    path(r"api/invoices/<int:pk>/pdf", apiviews.InvoicePDF.as_view()),
    path(r"api/invoices/zip", apiviews.BulkInvoicePDF.as_view()),
    path(
        r"api/invoices/<int:pk>/modifiers/<int:modifier>",
        apiviews.InvoiceModifierDetail.as_view(),
    ),
    path(r"api/accounts/", apiviews.AccountList.as_view()),
    path(r"api/tasks/", apiviews.TaskList.as_view(), name="tasks-list"),
    path(r"api/tasks/<int:pk>", apiviews.TaskDetail.as_view()),
    path(
        r"api/tasks/<int:pk>/summary",
        apiviews.TaskSummary.as_view(),
        name="task-summary",
    ),
    path(r"api/contacts/", apiviews.ContactList.as_view(), name="contacts-list"),
    path(
        r"api/contacts/<int:pk>",
        apiviews.ContactDetail.as_view(),
        name="contacts-detail",
    ),
    path(r"api/modifiers/", apiviews.InvoiceModifierList.as_view()),
    path(r"api/companies/", apiviews.CompanyList.as_view()),
    path(r"api/companies/<int:pk>", apiviews.CompanyDetail.as_view()),
    path(r"api/version/", apiviews.VersionView.as_view()),
    path(r"api/currency/rates/", apiviews.ExchangeRatesView.as_view()),
    path(r"api/logout/", views.logout_user),
    # App Routing
    path(r"", views.landing),
]
