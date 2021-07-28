from django.contrib import admin

from crm import models


@admin.register(models.Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("content",)
