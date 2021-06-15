from django_filters.filters import DateFilter, BooleanFilter
from django_filters.rest_framework import FilterSet
from journal.models import TimeSlip, Task, Invoice


class TimeSlipFilter(FilterSet):
    start = DateFilter(field_name="date", lookup_expr="gte")
    end = DateFilter(field_name="date", lookup_expr="lte")
    no_invoice = BooleanFilter(field_name="invoice", lookup_expr="isnull")

    class Meta:
        model = TimeSlip
        fields = ["invoice", "project", "start", "end", "no_invoice"]


class TaskFilter(FilterSet):
    no_invoice = BooleanFilter(field_name="invoices", lookup_expr="isnull")

    class Meta:
        model = Task
        fields = ["invoices", "project", "no_invoice"]
