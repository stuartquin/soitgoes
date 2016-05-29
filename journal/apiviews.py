from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission

from . import serializers, models


class HasProjectAccess(BasePermission):
    def has_permission(self, request, view):
        project_id = request.parser_context['kwargs']['project']
        project = models.Project.objects.filter(id=project_id).first()
        return len(project.account.users.filter(id=request.user.id)) > 0

    def has_object_permission(self, request, view, obj):
        return True


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


class InvoiceList(generics.ListCreateAPIView):
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer


class TimeSlipList(generics.ListCreateAPIView):
    queryset = models.TimeSlip.objects.all()
    serializer_class = serializers.TimeSlipSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        if 'data' in kwargs:
            kwargs['many'] = True
        return serializer_class(*args, **kwargs)

    def list(self, request, project=None):
        filters = {}
        if project:
            filters['project'] = project

        if 'invoice' in request.query_params:
            invoice = request.query_params['invoice']
            filters['invoice'] = invoice if invoice != 'null' else None

        if 'user' in request.query_params:
            # @TODO This doesn't work yet, should check permissions etc.
            filters['user'] = request.query_params['user']
        else:
            filters['user'] = request.user

        timeslips = models.TimeSlip.objects.filter(**filters)
        serializer = serializers.TimeSlipSerializer(timeslips, many=True)
        return Response(serializer.data)
