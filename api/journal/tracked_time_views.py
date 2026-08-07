from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics

from journal import serializers, models
from journal.apiviews import get_allowed_projects
from journal.filters import TrackedTimeFilter
from journal.permissions import HasTrackedTimeAccess


class TrackedTimeList(generics.ListCreateAPIView):
    queryset = models.TrackedTime.objects.all()
    serializer_class = serializers.TrackedTimeSerializer
    permission_classes = (HasTrackedTimeAccess,)

    filter_backends = [DjangoFilterBackend]
    filterset_class = TrackedTimeFilter

    def get_queryset(self):
        return models.TrackedTime.objects.filter(
            project__in=get_allowed_projects(self.request)
        ).order_by("-started_at")


class TrackedTimeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.TrackedTime.objects.all()
    serializer_class = serializers.TrackedTimeSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        if "data" in kwargs:
            kwargs["partial"] = True

        return self.serializer_class(*args, **kwargs)
