from django.contrib import admin

from . import models


@admin.register(models.Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')


@admin.register(models.Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'created_at')


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')


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
    list_display = ('reference', 'value', 'date', 'paid_at', 'monzo_id')
    actions = ['copy_paid_at']

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


@admin.register(models.InvoiceItem)
class InvoiceItem(admin.ModelAdmin):
    list_display = ('name', 'created_at')

    def name(self, obj):
        return obj


@admin.register(models.TimeSlip)
class TimeSlipAdmin(admin.ModelAdmin):
    list_display = ('name', 'hours', 'invoice', 'date')

    def name(self, obj):
        return obj
