from django_filters import DateFilter
from django_filters.rest_framework import FilterSet

from financeapp.models import BankTransaction


class BankTransactionFilter(FilterSet):
    start = DateFilter(field_name="date", lookup_expr="gte")
    end = DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = BankTransaction
        fields = ["bank_account", "start", "end"]
