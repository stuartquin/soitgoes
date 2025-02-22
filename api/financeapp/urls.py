from django.urls import path

from financeapp import apiviews

urlpatterns = [
    path(
        r"transactions/",
        apiviews.BankTransactionListView.as_view(),
        name="transactions_list",
    ),
]
