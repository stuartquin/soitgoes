from django.contrib import admin

from . import models


@admin.register(models.BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "bank_name",
        "account",
    )


@admin.register(models.BankTransaction)
class BankTransactionAdmin(admin.ModelAdmin):
    list_filter = ("bank_account",)
    list_display = ("bank_account",)
