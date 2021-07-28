from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission
from crm import models


class HasNoteAccess(BasePermission):
    def has_permission(self, request, view):
        pk = request.parser_context["kwargs"]["pk"]
        note = get_object_or_404(models.Note.objects, pk=pk)
        return request.user.account_set.filter(id=note.contact.account.id).exists()
