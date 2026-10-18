from django.urls import path

from financeapp import apiviews

urlpatterns = [
    path(
        r"transactions/",
        apiviews.BankTransactionListView.as_view(),
        name="transactions_list",
    ),
    path(
        r"tag_type/",
        apiviews.TagTypeListView.as_view(),
        name="tag_type_list",
    ),
    path(
        r"bank_account/",
        apiviews.BankAccountListView.as_view(),
        name="bank_account_list",
    ),
]
