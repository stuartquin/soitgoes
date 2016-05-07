from django.contrib import admin

from .models import Contact, Project, TimeSlip, Invoice


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('sequence_num', )


@admin.register(TimeSlip)
class TimeSlipAdmin(admin.ModelAdmin):
    list_display = ('name', 'hours', 'date')

    def name(self, obj):
        return obj
