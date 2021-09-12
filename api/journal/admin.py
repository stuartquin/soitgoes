import csv
from django.contrib import admin
from django.http import HttpResponse

from . import models

from admincalendar.admincalendar import register_admincalendar, AdminCalendar


@admin.register(models.Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")


@admin.register(models.Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ("bank_name", "created_at")


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")


@admin.register(models.Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")

    def name(self, obj):
        return obj.company.name


@admin.register(models.Company)
class CompanyAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    list_filter = ("project",)

    def name(self, obj):
        return obj


class InvoiceCalendar(AdminCalendar):
    admin_calendar_add_field = "paid_at"
    admin_calendar_fields = [
        {"start": "due_date", "title": "name", "color": "red"},
        {"start": "issued_at", "title": "name", "color": "pink"},
        {"start": "paid_at", "title": "name", "color": "green"},
    ]


register_admincalendar(InvoiceCalendar, models.Invoice)


@admin.register(models.InvoiceModifier)
class InvoiceModifierAdmin(admin.ModelAdmin):
    list_display = ("obj", "created_at")

    def obj(self, obj):
        return obj


@admin.register(models.TimeSlip)
class TimeSlipAdmin(admin.ModelAdmin):
    list_display = ("name", "hours", "invoice", "date")
    list_filter = ("project",)

    def name(self, obj):
        return obj


class TimeSlipCalendar(AdminCalendar):
    admin_calendar_add_field = "date"
    admin_calendar_fields = [{"start": "date", "end": "end_date"}]
    list_display = ("hours", "invoice", "date")
    list_filter = ("project",)


register_admincalendar(TimeSlipCalendar, models.TimeSlip, "Time Slip Calendar")


class TaskNote(admin.StackedInline):
    model = models.TaskNote


@admin.register(models.Task)
class Task(admin.ModelAdmin):
    list_display = ("project", "name", "due_date")
    list_filter = ("project",)
    inlines = [TaskNote]


@admin.register(models.TaskInvoice)
class TaskInvoiceAdmin(admin.ModelAdmin):
    list_display = ("task", "invoice", "cost", "created_at")
