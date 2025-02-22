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
    tags: "models.QuerySet[Tag]"

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

    @property
    def amount_pounds(self):
        return float(self.amount / 100.0)


class Rule(models.Model):
    tags: "models.QuerySet[Tag]"

    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    conditions = models.JSONField()
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="finance_rules"
    )
    tag_definitions = models.JSONField()
    bank_account = models.ForeignKey(
        BankAccount,
        on_delete=models.CASCADE,
        related_name="rules",
        blank=True,
        null=True,
    )


class Tag(models.Model):
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="finance_tags"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    bank_transaction = models.ForeignKey(
        BankTransaction, on_delete=models.CASCADE, related_name="tags"
    )
    rule = models.ForeignKey(
        Rule, on_delete=models.SET_NULL, null=True, blank=True, related_name="tags"
    )
    tag_type = models.TextField(db_index=True)
    value = models.TextField()
    meta = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.tag_type}={self.value} ({self.bank_transaction})"
