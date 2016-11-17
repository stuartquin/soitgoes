from django.contrib.admin.filters import SimpleListFilter


class ExpensePaidFilter(SimpleListFilter):
    title = 'Expenses Paid'
    parameter_name = 'paid_at'

    def lookups(self, request, model_admin):
        return (
            (0, 'Unpaid'),
            (1, 'Paid'),
            (2, 'All'),
        )

    def queryset(self, request, queryset):
        if self.value() == '1':
            return queryset.exclude(paid_at=None)
        if self.value() == '0':
            return queryset.filter(paid_at=None)
        return queryset
