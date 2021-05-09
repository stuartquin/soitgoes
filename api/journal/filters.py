from django_filters.filters import DateFilter, DateRangeFilter
from django_filters.rest_framework import FilterSet
from journal.models import TimeSlip


class TimeSlipFilter(FilterSet):
    start = DateFilter(field_name="date", lookup_expr="gte")
    end = DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = TimeSlip
        fields = ["project", "start", "end"]
