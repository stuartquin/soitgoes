from django_filters.rest_framework import FilterSet
from crm.models import Note


class NoteFilter(FilterSet):
    class Meta:
        model = Note
        fields = ["contact"]
