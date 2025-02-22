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
    list_display = (
        "bank_account",
        "date",
        "description",
        "amount",
    )


@admin.register(models.Tag)
class TagAdmin(admin.ModelAdmin):
    list_filter = ("bank_transaction__bank_account",)
    list_display = (
        "bank_transaction",
        "tag_type",
        "value",
    )
