from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.response import Response

from . import serializers, models


class ProjectList(generics.ListAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer


class ProjectDetail(generics.RetrieveAPIView):
    serializer_class = serializers.ProjectSerializer

    def retrieve(self, request, pk=None):
        project = get_object_or_404(models.Project.objects.all(), pk=pk)
        serializer = serializers.ProjectSerializer(project)
        return Response(serializer.data)


class InvoiceList(generics.ListCreateAPIView):
    queryset = models.Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer


class TimeSlipList(generics.ListCreateAPIView):
    queryset = models.TimeSlip.objects.all()
    serializer_class = serializers.TimeSlipSerializer

    def create(self, request, project=None):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data)

    def list(self, request, project=None):
        import ipdb; ipdb.set_trace()
        filters = {
            'project': project
        }
        if 'invoice' in request.query_params:
            invoice = request.query_params['invoice']
            filters['invoice'] = invoice if invoice != 'null' else None

        timeslips = models.TimeSlip.objects.filter(**filters)
        serializer = serializers.TimeSlipSerializer(timeslips, many=True)
        return Response(serializer.data)
