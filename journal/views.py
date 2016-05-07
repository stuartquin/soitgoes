from rest_framework import generics

from .models import Project, Invoice, TimeSlip
from .serializers import ProjectSerializer, TimeSlipSerializer


class ProjectList(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)


class TimeSlipList(generics.ListCreateAPIView):
    serializer_class = TimeSlipSerializer

    def get_queryset(self):
        import ipdb; ipdb.set_trace()
        project = self.request.query_params.get("project", None)
        return TimeSlip.objects.filter(project=project)


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
