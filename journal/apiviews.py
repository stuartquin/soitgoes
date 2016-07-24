from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission

from . import serializers, models


class HasProjectAccess(BasePermission):
    def has_permission(self, request, view):
        project_id = request.parser_context['kwargs']['pk']
        project = models.Project.objects.filter(id=project_id).first()
        return len(project.account.users.filter(id=request.user.id)) > 0


class HasInvoiceAccess(BasePermission):
    def has_permission(self, request, view):
        invoice = models.Invoice.objects.get(
            id=request.parser_context['kwargs']['pk']
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


class ProjectList(generics.ListAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer
    # permission_classes = (HasProjectAccess,)


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
    queryset = models.Invoice.objects.all().order_by('-created_at')
    serializer_class = serializers.InvoiceSerializer


class InvoiceItem(generics.ListCreateAPIView):
    queryset = models.InvoiceItem.objects.all().order_by('-created_at')
    serializer_class = serializers.InvoiceItemSerializer


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
    permission_classes = (HasTimeslipAccess,)


class TimeSlipList(generics.ListCreateAPIView):
    queryset = models.TimeSlip.objects.all()
    permission_classes = (HasTimeslipAccess,)
    serializer_class = serializers.TimeSlipSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['many'] = True

        return self.serializer_class(*args, **kwargs)

    def list(self, request):
        filters = {}
        if 'project' in request.query_params:
            filters['project'] = request.query_params['project']

        if 'invoice' in request.query_params:
            invoice = request.query_params['invoice']
            filters['invoice'] = invoice if invoice != 'none' else None

        if 'user' in request.query_params:
            # @TODO This doesn't work yet, should check permissions etc.
            filters['user'] = request.query_params['user']
        else:
            filters['user'] = request.user

        timeslips = models.TimeSlip.objects.filter(**filters)
        serializer = self.serializer_class(timeslips, many=True)
        return Response(serializer.data)
