from django.db.models import Q
from django.db.utils import IntegrityError
from rest_framework import generics

from .models import Thought, Tag
from .serializers import ThoughtSerializer, TagSerializer


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)


class ThoughtList(generics.ListCreateAPIView):
    queryset = Thought.objects.all()
    serializer_class = ThoughtSerializer

    def perform_create(self, serializer):
        for tag in self.request.data["tags"]:
            try:
                Tag.objects.create(tag=tag, user=self.request.user)
            except IntegrityError:
                print("Tag Exists %s" % tag)

        serializer.save(user=self.request.user)

    def get_queryset(self):
        tags = self.request.query_params.get("tags", None)
        filters = []
        if tags:
            filters = self.filter_by_tags(tags.split(","))

        return Thought.objects.filter(*filters)

    def filter_by_tags(self, tags):
        return list(map(lambda x: Q(tags__contains=x), tags))
