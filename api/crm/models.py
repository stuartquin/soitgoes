from django.db import models

from journal.models import Contact


class Note(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name="notes")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
