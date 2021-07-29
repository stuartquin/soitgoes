from django.db.models import Q
from django_filters.filters import DateFilter, BooleanFilter, CharFilter
from django_filters.rest_framework import FilterSet
from journal.models import TimeSlip, Task, Invoice, Contact, Project


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
        fields = ["invoices", "project", "no_invoice", "billing_type"]


class ContactFilter(FilterSet):
    search = CharFilter(method="filter_search")

    def filter_search(self, queryset, name, value):
        contacts = Project.objects.filter(name__icontains=value).values_list(
            "contact", flat=True
        )

        return queryset.filter(Q(name__icontains=value) | Q(id__in=contacts))

    class Meta:
        model = Contact
        fields = ["search"]
