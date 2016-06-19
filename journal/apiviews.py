from django.shortcuts import get_object_or_404

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


class HasTimeslipAccess(BasePermission):
    def has_permission(self, request, view):
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


class ProjectDetail(APIView):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (HasProjectAccess,)

    def get(self, request, pk=None):
        project = get_object_or_404(models.Project.objects.all(), pk=pk)
        serializer = serializers.ProjectSerializer(project)
        return Response(serializer.data)


class InvoiceDetail(generics.ListCreateAPIView):
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer

    def perform_create(self, serializer):
        ids = self.request.data['timeslips']
        invoice = serializer.save()
        timeslips = models.TimeSlip.objects.filter(id__in=ids)
        timeslips.update(invoice=invoice.id)


class TimeSlipDetail(generics.UpdateAPIView):
    queryset = models.TimeSlip.objects.all()
    serializer_class = serializers.TimeSlipReadSerializer
    permission_classes = (HasTimeslipAccess,)


class TimeSlipList(generics.ListCreateAPIView):
    queryset = models.TimeSlip.objects.all()
    permission_classes = (HasTimeslipAccess,)

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['many'] = True

        if self.request.method == 'GET':
            return serializers.TimeSlipReadSerializer(*args, **kwargs)
        else:
            return serializers.TimeSlipWriteSerializer(*args, **kwargs)

    def list(self, request, project=None):
        filters = {}
        if project:
            filters['project'] = project

        if 'invoice' in request.query_params:
            invoice = request.query_params['invoice']
            filters['invoice'] = invoice if invoice != 'none' else None

        if 'user' in request.query_params:
            # @TODO This doesn't work yet, should check permissions etc.
            filters['user'] = request.query_params['user']
        else:
            filters['user'] = request.user

        timeslips = models.TimeSlip.objects.filter(**filters)
        serializer = serializers.TimeSlipReadSerializer(timeslips, many=True)
        return Response(serializer.data)
