from rest_framework import serializers

from financeapp.models import BankAccount


class BankTransactionSerializer(serializers.Serializer):
    bank_account = serializers.PrimaryKeyRelatedField(
        queryset=BankAccount.objects.all()
    )
    transaction_id = serializers.CharField(read_only=True)
    date = serializers.DateTimeField(read_only=True)
    amount = serializers.IntegerField(read_only=True)
    balance = serializers.IntegerField(read_only=True)
    source = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    transaction_type = serializers.CharField(read_only=True)
