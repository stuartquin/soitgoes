import json
import zipfile
import datetime
from django.contrib import auth
from django.core.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission

from . import serializers, models, summary
from .cookieauthentication import CookieAuthentication
from journal.invoices import save_invoice_tasks, get_new_invoice, set_invoice_totals


class HasProjectAccess(BasePermission):
    def has_permission(self, request, view):
        project_id = request.parser_context['kwargs']['pk']
        project = models.Project.objects.filter(id=project_id).first()
        return len(project.account.users.filter(id=request.user.id)) > 0


class HasBulkInvoiceAccess(BasePermission):
    def has_permission(self, request, view):
        return True


class HasInvoiceAccess(BasePermission):
    def has_permission(self, request, view):
        invoice_id = request.query_params.get('invoice', None) or request.data.get('invoice', None)

        if invoice_id is None:
            invoice_id = request.parser_context['kwargs']['pk']

        invoice = models.Invoice.objects.get(
            id=invoice_id
        )
        project = models.Project.objects.filter(id=invoice.project_id).first()
        return len(project.account.users.filter(id=request.user.id)) > 0


class HasTimeslipAccess(BasePermission):
    def has_permission(self, request, view):
        # @TODO this needs fixed
        if request.method == 'GET':
            return True

        if 'project' in request.data:
            project_ids = set([request.data['project']])
        else:
            project_ids = set([data['project'] for data in request.data])

        projects = models.Project.objects.filter(id__in=project_ids)
        # list flatten
        users = set([u.id for p in projects for u in p.account.users.all()])
        return request.user.id in users


class AccountList(generics.ListAPIView):
    # TODO Needs permissions
    serializer_class = serializers.AccountSerializer

    def get_queryset(self):
        account = self.request.user.account_set.all()
        return account


class UserDetail(APIView):
    serializer_class = serializers.UserSerializer

    def get(self, request, pk=None):
        user = serializers.UserSerializer(self.request.user)
        return Response(user.data)


class LoginView(APIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = serializers.UserTokenSerializer

    @csrf_exempt
    def post(self, request, pk=None):
        username = request.data.get('username', None)
        password = request.data.get('password', None)
        user = auth.authenticate(username=username, password=password)

        if user and user.is_active:
            auth.login(request, user)
            response = Response(self.serializer_class(user.auth_token).data)
            response.set_cookie('sig_token', user.auth_token)
            return response

        raise PermissionDenied()

    @csrf_exempt
    def delete(self, request, pk=None):
        response = Response()
        response.delete_cookie('sig_token')
        return response


class ProjectList(generics.ListCreateAPIView):
    serializer_class = serializers.ProjectSerializer

    def get_queryset(self):
        return models.Project.objects.all().order_by('-created_at')


class ActivityFeedList(generics.ListAPIView):
    serializer_class = serializers.ActivitySerializer

    def get_queryset(self):
        return models.Activity.objects.all().order_by('-created_at')[:10]


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ProjectSerializer
    queryset = models.Project.objects.all()
    permission_classes = (HasProjectAccess,)

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)

    def get(self, request, pk=None):
        project = get_object_or_404(models.Project.objects.all(), pk=pk)
        serializer = serializers.ProjectSerializer(project)
        return Response(serializer.data)


class InvoiceDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (HasInvoiceAccess,)
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceDetailSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)

    def perform_update(self, serializer, *args, **kwargs):
        validated = serializer.validated_data
        if validated['paid_at'] is None and validated['status'] == 'PAID':
            serializer.validated_data['total_paid'] = validated['total_due']
            serializer.validated_data['paid_at'] = datetime.datetime.now()

        serializer.save()


class InvoiceCreateNew(APIView):
    def get(self, request, format=None):
        return Response(get_new_invoice(request.GET.get('project')))


class InvoiceListCreate(generics.ListCreateAPIView):
    serializer_class = serializers.InvoiceSerializer

    def get_queryset(self):
        return models.Invoice.objects.all().order_by('-issued_at')

    def perform_create(self, serializer):
        sequence_num = models.Invoice.get_next_sequence_num(
            serializer.validated_data['project']
        )
        serializer.validated_data['sequence_num'] = sequence_num
        tasks = []
        if 'tasks' in serializer.validated_data:
            tasks = serializer.validated_data['tasks']
            del serializer.validated_data['tasks']

        invoice = serializer.save()
        save_invoice_tasks(invoice, tasks)
        set_invoice_totals(invoice)


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
        invoice.modifier.remove(
            models.InvoiceModifier.objects.get(id=modifier)
        )
        invoice.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InvoicePDF(APIView):
    permission_classes = (HasInvoiceAccess,)
    authentication_classes = (CookieAuthentication, )

    def get(self, request, pk=None):
        invoice = models.Invoice.objects.get(id=pk)
        pdf = invoice.get_pdf_file(request.user)
        response = HttpResponse(pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="%s"' % invoice.pdf_name
        pdf.close()
        return response

class BulkInvoicePDF(APIView):
    permission_classes = (HasBulkInvoiceAccess,)

    def get(self, request, pk=None):
        invoice_ids = request.query_params.get('invoice_ids', '').split(',')
        invoices = models.Invoice.objects.filter(id__in=invoice_ids)

        zip_file = models.Invoice.get_bulk_file(invoices, request.user)

        response = HttpResponse(
            open(zip_file, 'rb').read(),
            content_type='application/zip'
        )
        response['Content-Disposition'] = 'attachment; filename="Invoices.zip"'
        return response


class TimeSlipDetail(generics.UpdateAPIView):
    queryset = models.TimeSlip.objects.all()
    serializer_class = serializers.TimeSlipSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)


class TimeSlipList(generics.ListCreateAPIView):
    queryset = models.TimeSlip.objects.all()
    permission_classes = (HasTimeslipAccess,)
    serializer_class = serializers.TimeSlipSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['many'] = True
            for timeslip in kwargs['data']:
                timeslip['user'] = self.request.user.pk

        return self.serializer_class(*args, **kwargs)

    def get_queryset(self):
        filters = {
        }
        if 'project' in self.request.query_params:
            filters['project'] = self.request.query_params['project']

        if 'start' in self.request.query_params:
            filters['date__gte'] = self.request.query_params['start']

        if 'end' in self.request.query_params:
            filters['date__lte'] = self.request.query_params['end']

        if 'invoice' in self.request.query_params:
            invoice = self.request.query_params['invoice']
            filters['invoice'] = invoice if invoice != 'none' else None

        if 'ids' in self.request.query_params:
            ids = self.request.query_params['ids'].split(',')
            filters['id__in'] = ids

        return models.TimeSlip.objects.filter(**filters).order_by('date')


class SummaryInvoices(APIView):
    def get(self, request, pk=None):
        if 'start' in request.query_params:
            start = request.query_params['start']

        if 'end' in request.query_params:
            end = request.query_params['end']

        dates = summary.invoice_summary_monthly(start, end)
        response = HttpResponse(
            json.dumps(dates),
            content_type='application/json'
        )
        return response


class TaskList(generics.ListCreateAPIView):
    serializer_class = serializers.TaskSerializer

    def get_queryset(self):
        filters = {
        }
        if 'project' in self.request.query_params:
            filters['project'] = self.request.query_params['project']

        if 'invoice' in self.request.query_params:
            invoice = self.request.query_params['invoice']
            filters['invoice'] = invoice if invoice != 'none' else None

        return models.Task.objects.filter(**filters).order_by('-activity_at')


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)


class CompanyList(generics.ListCreateAPIView):
    serializer_class = serializers.CompanySerializer

    def get_queryset(self):
        filters = {}
        return models.Company.objects.filter(**filters)


class CompanyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)


class ContactList(generics.ListCreateAPIView):
    serializer_class = serializers.ContactSerializer

    def get_queryset(self):
        filters = {
            'account__in': self.request.user.account_set.all()
        }

        return models.Contact.objects.filter(**filters)


class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Contact.objects.all()
    serializer_class = serializers.ContactSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)


class InvoiceTaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer

    def destroy(self, request, pk=None, modifier=None):
        invoice = models.Invoice.objects.get(id=pk)
        invoice.modifier.remove(
            models.InvoiceModifier.objects.get(id=modifier)
        )
        invoice.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
