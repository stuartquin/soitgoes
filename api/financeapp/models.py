import uuid

from django.db import models

from journal.models import Account


class BankAccount(models.Model):
    bank_transactions: "models.QuerySet[BankTransaction]"

    created_at = models.DateTimeField(auto_now_add=True)
    uuid = models.UUIDField(
        unique=True, db_index=True, editable=False, default=uuid.uuid4
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="bank_accounts"
    )
    opening_balance = models.IntegerField(
        help_text="Initial value to offset total generated from transactions"
    )
    name = models.TextField()
    bank_name = models.TextField()

    def __str__(self):
        return f"{self.name} {self.bank_name}"


class BankTransaction(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    bank_account = models.ForeignKey(
        BankAccount, on_delete=models.CASCADE, related_name="bank_transactions"
    )
    transaction_id = models.TextField(db_index=True)
    date = models.DateTimeField(db_index=True)
    amount = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    transaction_type = models.TextField(blank=True, null=True)
    balance = models.IntegerField(blank=True, null=True)
    source = models.TextField()

    def __str__(self):
        return f"{self.bank_account} {self.date} {self.amount}"
