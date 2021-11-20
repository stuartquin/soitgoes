from django.contrib.auth import get_user_model
from django_filters.filters import CharFilter
from django_filters.rest_framework import FilterSet


User = get_user_model()


class SSOFilter(FilterSet):
    """
    code field is for code-gen purposes only
    """

    code = CharFilter(method="code_filter", label="code")

    class Meta:
        model = User
        fields = ["code"]

    def code_filter(self, queryset, *args):
        return queryset
