from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.response import Response

from .models import Project, Invoice, TimeSlip
from .serializers import ProjectSerializer, TimeSlipSerializer, InvoiceSerializer


class ProjectList(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetail(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer

    def retrieve(self, request, pk=None):
        project = get_object_or_404(Project.objects.all(), pk=pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)


class InvoiceCreate(generics.CreateAPIView):
    serializer_class = InvoiceSerializer

    def perform_create(self, serializer):
        import ipdb; ipdb.set_trace()
        serializer.save()


class TimeSlipList(generics.ListCreateAPIView):
    serializer_class = TimeSlipSerializer
    queryset = TimeSlip.objects.all()

    def list(self, request, project=None):
        timeslips = TimeSlip.objects.filter(project=project)
        serializer = TimeSlipSerializer(timeslips, many=True)
        return Response(serializer.data)


class TimeSlipDetail(generics.RetrieveAPIView):
    queryset = TimeSlip.objects.all()
    serializer_class = TimeSlipSerializer

# class ThoughtList(generics.ListCreateAPIView):
#     queryset = Thought.objects.all()
#     serializer_class = ThoughtSerializer
# 
#     def perform_create(self, serializer):
#         for tag in self.request.data["tags"]:
#             try:
#                 Tag.objects.create(tag=tag, user=self.request.user)
#             except IntegrityError:
#                 print("Tag Exists %s" % tag)
# 
#         serializer.save(user=self.request.user)
# 
#     def get_queryset(self):
#         tags = self.request.query_params.get("tags", None)
#         filters = []
#         if tags:
#             filters = self.filter_by_tags(tags.split(","))
# 
#         return Thought.objects.filter(*filters)
# 
#     def filter_by_tags(self, tags):
#         return list(map(lambda x: Q(tags__contains=x), tags))
