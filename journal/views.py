from django.db.models import Q
from rest_framework import generics

from .models import Thought
from .serializers import ThoughtSerializer


class ThoughtList(generics.ListCreateAPIView):
    queryset = Thought.objects.all()
    serializer_class = ThoughtSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        tags = self.request.query_params.get("tags", None)
        filters = []
        if tags:
            filters = self.filter_by_tags(tags.split(","))

        return Thought.objects.filter(*filters)

    def filter_by_tags(self, tags):
        return list(map(lambda x: Q(tags__contains=x), tags))
