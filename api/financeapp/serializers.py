from rest_framework import serializers

from financeapp.models import BankAccount, Rule


class TagSerializer(serializers.Serializer):
    created_at = serializers.DateTimeField()
    rule = serializers.PrimaryKeyRelatedField(queryset=Rule.objects.all())
    tag_type = serializers.CharField()
    value = serializers.CharField()
    meta = serializers.JSONField(required=False)


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
    tags = TagSerializer(many=True)


class TagTypeSerializer(serializers.Serializer):
    tag_type = serializers.CharField()
    value = serializers.CharField()
    count = serializers.IntegerField()


class BankAccountSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    bank_name = serializers.CharField()
