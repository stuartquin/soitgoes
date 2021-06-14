from django_filters.filters import DateFilter, BooleanFilter
from django_filters.rest_framework import FilterSet
from journal.models import TimeSlip, Task, Invoice


class TimeSlipFilter(FilterSet):
    start = DateFilter(field_name="date", lookup_expr="gte")
    end = DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = TimeSlip
        fields = ["invoice", "project", "start", "end"]


class TaskFilter(FilterSet):
    class Meta:
        model = Task
        fields = ["invoices", "project"]
