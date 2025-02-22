from django.db.models import Count, QuerySet
from django.http import HttpRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics

from financeapp import serializers
from financeapp.filters import BankTransactionFilter
from financeapp.models import BankAccount, BankTransaction, Tag


def get_allowed_bank_accounts(request: HttpRequest) -> QuerySet[BankAccount]:
    if not request or not request.user or not request.user.is_authenticated:
        return BankAccount.objects.none()
    return BankAccount.objects.filter(account__in=request.user.account_set.all())


class BankAccountListView(generics.ListAPIView):
    serializer_class = serializers.BankAccountSerializer

    def get_queryset(self):
        return get_allowed_bank_accounts(self.request)


class BankTransactionListView(generics.ListAPIView):
    serializer_class = serializers.BankTransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BankTransactionFilter

    def get_queryset(self):
        return (
            BankTransaction.objects.filter(
                bank_account__in=get_allowed_bank_accounts(self.request)
            )
            .select_related("bank_account")
            .order_by("-date")
        )


class TagTypeListView(generics.ListAPIView):
    serializer_class = serializers.TagTypeSerializer

    def get_queryset(self):
        return (
            Tag.objects.filter(account__in=self.request.user.account_set.all())
            .values("tag_type", "value")
            .annotate(count=Count("tag_type"))
            .order_by("tag_type")
        )
