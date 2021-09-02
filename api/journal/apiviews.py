from journal.currency import get_rates
import os
import json
import zipfile
import datetime
from django.contrib import auth
from django.core.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpRequest
from django.db.models import Q
from django.db.models.query import QuerySet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.schemas.openapi import AutoSchema

from users.onetimetoken import OneTimeTokenAccess

from journal import serializers, models, summary
from journal.cookieauthentication import CookieAuthentication
from journal.project import get_unbilled_summary
from journal.filters import TimeSlipFilter, TaskFilter, ContactFilter
from journal.invoices import (
    save_invoice_tasks,
    get_new_invoice,
    set_invoice_totals,
)
from journal.permissions import (
    HasContactAccess,
    HasProjectAccess,
    HasTaskAccess,
    HasInvoiceAccess,
    HasBulkInvoiceAccess,
    HasTimeslipAccess,
)


def get_allowed_contacts(request: HttpRequest) -> "QuerySet[models.Contact]":
    if not request or not request.user or not request.user.is_authenticated:
        return models.Contact.objects.none()
    return models.Contact.objects.filter(account__in=request.user.account_set.all())


def get_allowed_projects(request: HttpRequest) -> "QuerySet[models.Project]":
    if not request or not request.user or not request.user.is_authenticated:
        return models.Project.objects.none()
    return models.Project.objects.filter(account__in=request.user.account_set.all())


class AccountList(generics.ListAPIView):
    # TODO Needs permissions
    serializer_class = serializers.AccountSerializer

    def get_queryset(self):
        account = self.request.user.account_set.all()
        return account


class ProjectList(generics.ListCreateAPIView):
    serializer_class = serializers.ProjectSerializer

    def get_queryset(self):
        queryset = get_allowed_projects(self.request)
        return queryset.order_by("-created_at")


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ProjectSerializer
    queryset = models.Project.objects.all()
    permission_classes = (HasProjectAccess,)

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        if "data" in kwargs:
            kwargs["partial"] = True

        return self.serializer_class(*args, **kwargs)

    def get(self, request, pk=None):
        project = get_object_or_404(models.Project.objects.all(), pk=pk)
        serializer = serializers.ProjectSerializer(project)
        return Response(serializer.data)


class InvoiceDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (HasInvoiceAccess,)
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        if "data" in kwargs:
            kwargs["partial"] = True

        return self.serializer_class(*args, **kwargs)

    def perform_update(self, serializer, *args, **kwargs):
        validated = serializer.validated_data
        if validated.get("paid_at") is None and validated["status"] == "PAID":
            serializer.validated_data["paid_at"] = datetime.datetime.now()

        if "tasks" in serializer.validated_data:
            del serializer.validated_data["tasks"]

        serializer.save()


class InvoiceListCreate(generics.ListCreateAPIView):
    serializer_class = serializers.InvoiceSerializer

    def perform_create(self, serializer):
        sequence_num = models.Invoice.get_next_sequence_num(
            serializer.validated_data["project"]
        )
        serializer.validated_data["sequence_num"] = sequence_num
        tasks = []
        if "tasks" in serializer.validated_data:
            tasks = serializer.validated_data["tasks"]
            del serializer.validated_data["tasks"]

        invoice = serializer.save()
        save_invoice_tasks(invoice, tasks)
        set_invoice_totals(invoice)

    def get_queryset(self):
        filters = {}
        if "project" in self.request.query_params:
            filters["project"] = self.request.query_params["project"]

        return models.Invoice.objects.filter(**filters).order_by("-issued_at")


class InvoiceModifierList(generics.ListAPIView):
    serializer_class = serializers.InvoiceModifierSerializer

    def get_queryset(self):
        return models.InvoiceModifier.objects.all()


class InvoiceModifierDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (HasInvoiceAccess,)
    serializer_class = serializers.InvoiceModifierSerializer

    def get_queryset(self):
        return models.Invoice.objects.get(**self.kwargs).modifier.all()

    def destroy(self, request, pk=None, modifier=None):
        invoice = models.Invoice.objects.get(id=pk)
        invoice.modifier.remove(models.InvoiceModifier.objects.get(id=modifier))
        invoice.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InvoicePDF(APIView):
    permission_classes = (HasInvoiceAccess,)
    authentication_classes = (OneTimeTokenAccess,)

    def get(self, request, pk=None):
        invoice = models.Invoice.objects.get(id=pk)
        pdf = invoice.get_pdf_file(request.user)
        response = HttpResponse(pdf.read(), content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="%s"' % invoice.pdf_name
        pdf.close()
        return response


class BulkInvoicePDF(APIView):
    permission_classes = (HasBulkInvoiceAccess,)

    def get(self, request, pk=None):
        invoice_ids = request.query_params.get("invoice_ids", "").split(",")
        invoices = models.Invoice.objects.filter(id__in=invoice_ids)

        zip_file = models.Invoice.get_bulk_file(invoices, request.user)

        response = HttpResponse(
            open(zip_file, "rb").read(), content_type="application/zip"
        )
        response["Content-Disposition"] = 'attachment; filename="Invoices.zip"'
        return response


class TimeSlipDetail(generics.UpdateAPIView):
    queryset = models.TimeSlip.objects.all()
    serializer_class = serializers.TimeSlipSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        if "data" in kwargs:
            kwargs["partial"] = True

        return self.serializer_class(*args, **kwargs)


class TimeSlipList(generics.ListCreateAPIView):
    queryset = models.TimeSlip.objects.all()
    permission_classes = (HasTimeslipAccess,)
    serializer_class = serializers.TimeSlipSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = TimeSlipFilter

    def get_queryset(self):
        return models.TimeSlip.objects.filter(
            project__in=get_allowed_projects(self.request)
        )


class TaskList(generics.ListCreateAPIView):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = TaskFilter

    def get_queryset(self):
        return models.Task.objects.filter(
            project__in=get_allowed_projects(self.request)
        )


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        if "data" in kwargs:
            kwargs["partial"] = True

        return self.serializer_class(*args, **kwargs)


class ProjectSummary(generics.ListAPIView):
    serializer_class = serializers.ProjectSummarySerializer

    def get_queryset(self):
        projects = get_allowed_projects(self.request).filter(archived=False)
        summary = get_unbilled_summary(projects)
        return summary


class CompanyList(generics.ListCreateAPIView):
    serializer_class = serializers.CompanySerializer

    def get_queryset(self):
        filters = {}
        return models.Company.objects.filter(**filters)


class CompanyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        if "data" in kwargs:
            kwargs["partial"] = True

        return self.serializer_class(*args, **kwargs)


class ContactList(generics.ListCreateAPIView):
    serializer_class = serializers.ContactSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ContactFilter

    def get_queryset(self):
        return get_allowed_contacts(self.request)

    def perform_create(self, serializer):
        account = models.Account.get_user_account(self.request.user)
        serializer.validated_data["account_id"] = account.pk
        super().perform_create(serializer)


class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Contact.objects.all()
    serializer_class = serializers.ContactSerializer
    permission_classes = (HasContactAccess,)

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        if "data" in kwargs:
            kwargs["partial"] = True

        return self.serializer_class(*args, **kwargs)


class InvoiceTaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer

    def destroy(self, request, pk=None, modifier=None):
        invoice = models.Invoice.objects.get(id=pk)
        invoice.modifier.remove(models.InvoiceModifier.objects.get(id=modifier))
        invoice.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskSummary(generics.RetrieveAPIView):
    schema = AutoSchema(component_name="TaskSummary", operation_id_base="TaskSummary",)
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSummarySerializer
    permission_classes = (HasTaskAccess,)


class VersionView(generics.RetrieveAPIView):
    authentication_classes: list = []
    permission_classes: list = []
    serializer_class = serializers.VersionSerializer

    def get_object(self):
        return {
            "git_branch": os.environ.get("GIT_BRANCH"),
            "git_rev": os.environ.get("GIT_REV"),
        }


class ExchangeRatesView(generics.RetrieveAPIView):
    serializer_class = serializers.ExchangeRateSerializer

    def get_object(self):
        return {"rates": get_rates()}
