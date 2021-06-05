from django.db import models
from django.conf import settings
from rest_framework.authtoken.models import Token


class OneTimeToken(models.Model):
    key = models.CharField(max_length=40, primary_key=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name="one_time_token",
        on_delete=models.CASCADE,
    )
    created = models.DateTimeField(auto_now_add=True)
    expires = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = Token.generate_key()
        return super().save(*args, **kwargs)
