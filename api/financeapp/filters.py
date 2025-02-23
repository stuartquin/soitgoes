import json

from django.db.models import QuerySet
from django_filters import CharFilter, DateFilter
from django_filters.rest_framework import FilterSet

from financeapp.models import BankTransaction
from financeapp.rules import parse_conditions


def filter_query(queryset: QuerySet[BankTransaction], name, value):
    print(f"{value=}")
    conditions = json.loads(value)
    print(f"{conditions=}")
    print(parse_conditions(conditions))
    return queryset.filter(parse_conditions(conditions))


class BankTransactionFilter(FilterSet):
    start = DateFilter(field_name="date", lookup_expr="gte")
    end = DateFilter(field_name="date", lookup_expr="lte")
    query = CharFilter(method=filter_query, field_name="query")

    class Meta:
        model = BankTransaction
        fields = ["bank_account", "start", "end", "query"]
