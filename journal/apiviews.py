import json

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission

from . import serializers, models, summary
from soitgoes.context_processors.cachebust import VERSION


class HasProjectAccess(BasePermission):
    def has_permission(self, request, view):
        project_id = request.parser_context['kwargs']['pk']
        project = models.Project.objects.filter(id=project_id).first()
        return len(project.account.users.filter(id=request.user.id)) > 0


# TODO Not yet implemented
class HasInvoiceItemAccess(BasePermission):
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
        import ipdb; ipdb.set_trace()
        user = serializers.UserSerializer(self.request.user)
        return Response(user.data)


class ProjectList(generics.ListAPIView):
    serializer_class = serializers.ProjectSerializer

    def get_queryset(self):
        return models.Project.objects.all().order_by('-created_at')


class ActivityFeedList(generics.ListAPIView):
    serializer_class = serializers.ActivitySerializer

    def get_queryset(self):
        return models.Activity.objects.all().order_by('-created_at')[:10]


class ProjectDetail(APIView):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (HasProjectAccess,)

    def get(self, request, pk=None):
        project = get_object_or_404(models.Project.objects.all(), pk=pk)
        serializer = serializers.ProjectSerializer(project)
        return Response(serializer.data)


class InvoiceDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (HasInvoiceAccess,)
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.InvoiceSerializer

    def get_queryset(self):
        if 'ids' in self.request.query_params:
            ids = self.request.query_params['ids'].split(',')
            return models.Invoice.objects.filter(id__in=ids)

        null = models.Invoice.objects.filter(issued_at__isnull=True)
        not_null = models.Invoice.objects.filter(
            issued_at__isnull=False
        ).order_by('-issued_at')

        return [item for item in null] + [item for item in not_null]


class InvoiceModifiers(generics.ListAPIView):
    permission_classes = (HasInvoiceAccess,)
    serializer_class = serializers.InvoiceModifierSerializer

    def get_queryset(self):
        return models.Invoice.objects.get(**self.kwargs).modifier.all()


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


class InvoiceItem(generics.DestroyAPIView):
    serializer_class = serializers.InvoiceItemSerializer
    queryset = models.InvoiceItem.objects.all()
    permission_classes = (HasInvoiceItemAccess,)


class InvoiceItems(generics.ListCreateAPIView):
    serializer_class = serializers.InvoiceItemSerializer
    queryset = models.InvoiceItem.objects.all()
    permission_classes = (HasInvoiceAccess,)

    def get_queryset(self):
        return models.InvoiceItem.objects.filter(
            **self.request.query_params.dict()
        )


class InvoicePDF(APIView):
    permission_classes = (HasInvoiceAccess,)

    def get(self, request, pk=None):
        invoice = models.Invoice.objects.get(id=pk)
        pdf = invoice.get_pdf_file()
        response = HttpResponse(pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="%s"' % invoice.pdf_name
        pdf.close()
        return response


class TimeSlipDetail(generics.UpdateAPIView):
    queryset = models.TimeSlip.objects.all()
    serializer_class = serializers.TimeSlipSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)


class ExpenseList(generics.ListCreateAPIView):
    queryset = models.Expense.objects.all()
    serializer_class = serializers.ExpenseSerializer

    def get_queryset(self):
        filters = {}
        if 'start' in self.request.query_params:
            filters['date__gte'] = self.request.query_params['start']

        if 'end' in self.request.query_params:
            filters['date__lte'] = self.request.query_params['end']
        return models.Expense.objects.filter(**filters).order_by('date')


class TimeSlipList(generics.ListCreateAPIView):
    queryset = models.TimeSlip.objects.all()
    permission_classes = (HasTimeslipAccess,)
    serializer_class = serializers.TimeSlipSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['many'] = True

        return self.serializer_class(*args, **kwargs)

    def get_queryset(self):
        filters = {
            'user': self.request.user
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


class SummaryExpenses(APIView):
    def get(self, request, pk=None):
        if 'start' in request.query_params:
            start = request.query_params['start']

        if 'end' in request.query_params:
            end = request.query_params['end']

        dates = summary.expense_summary_monthly(start, end)
        response = HttpResponse(
            json.dumps(dates),
            content_type='application/json'
        )
        return response


class Version(APIView):
    def get(self, request, pk=None):
        return Response({
            'hash': VERSION
        })


class TaskList(generics.ListCreateAPIView):
    serializer_class = serializers.TaskSerializer

    def get_queryset(self):
        filters = {
            'user': self.request.user
        }
        if 'project' in self.request.query_params:
            filters['project'] = self.request.query_params['project']

        if 'invoice' in self.request.query_params:
            invoice = self.request.query_params['invoice']
            filters['invoice'] = invoice if invoice != 'none' else None

        return models.Task.objects.filter(**filters).order_by('completed_at')


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['partial'] = True

        return self.serializer_class(*args, **kwargs)
