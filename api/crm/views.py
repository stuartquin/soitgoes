from django.shortcuts import render
from django.http import HttpRequest
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend

from journal.models import Contact
from crm import serializers, models, filters


def get_allowed_contacts(request: HttpRequest) -> list[Contact]:
    if not request or not request.user or not request.user.is_authenticated:
        return Contact.objects.none()
    return Contact.objects.filter(account__in=request.user.account_set.all())


class NoteListCreateView(generics.ListCreateAPIView):
    queryset = models.Note.objects.all()
    serializer_class = serializers.NoteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.NoteFilter

    def get_queryset(self):
        return models.Note.objects.filter(
            contact__in=get_allowed_contacts(self.request)
        )
