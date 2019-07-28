import csv
from django.contrib import admin
from django.http import HttpResponse

from . import models
from .filters import ExpensePaidFilter

from adminsheets.decorators import register_sheet


@register_sheet(models.Contact)
@admin.register(models.Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'vat_number', 'created_at')


@register_sheet(models.Billing)
@admin.register(models.Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'created_at')


@register_sheet(models.Project)
@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'currency', 'archived', 'default_task')


@admin.register(models.Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')

    def name(self, obj):
        return obj.company.name


@admin.register(models.Company)
class CompanyAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('date', 'type', 'reference', 'value', 'paid_at',)
    list_filter = (ExpensePaidFilter, )
    actions = ['copy_paid_at', 'export_as_csv']

    def export_as_csv(self,  request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=export.csv'

        writer = csv.writer(response)
        for obj in queryset:
            row = []
            for field in self.list_display:
                if field == 'date':
                    value = getattr(obj, field).strftime('%d/%m/%Y')
                else:
                    value = getattr(obj, field)
                row.append(value)
            writer.writerow(row)
        return response

    def copy_paid_at(self, request, queryset):
        items = list(queryset.reverse())
        first = items.pop()

        for item in items:
            item.paid_at = first.paid_at
            item.save()

        self.message_user(
            request,
            'Set Paid to %s for %s items.' % (first.paid_at, len(items))
        )


@admin.register(models.Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')

    def name(self, obj):
        return obj


@admin.register(models.InvoiceModifier)
class InvoiceModifierAdmin(admin.ModelAdmin):
    list_display = ('obj', 'created_at')

    def obj(self, obj):
        return obj


@admin.register(models.TimeSlip)
class TimeSlipAdmin(admin.ModelAdmin):
    list_display = ('name', 'hours', 'invoice', 'date')

    def name(self, obj):
        return obj


class TaskNote(admin.StackedInline):
    model = models.TaskNote


@admin.register(models.Task)
class Task(admin.ModelAdmin):
    list_display = ('project', 'name', 'due_date')
    inlines = [TaskNote]

@admin.register(models.TaskInvoice)
class TaskInvoiceAdmin(admin.ModelAdmin):
    list_display = ('task', 'invoice', 'cost', 'created_at')
