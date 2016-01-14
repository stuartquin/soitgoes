from django.contrib.auth.models import User
from django.db import models


class Tag(models.Model):
    user = models.ForeignKey(User)
    tag = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tag

    class Meta:
        unique_together = ('user', 'tag',)


class Thought(models.Model):
    user = models.ForeignKey(User)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.TextField(null=True)

    def save(self, *args, **kwargs):
        super(Thought, self).save(*args, **kwargs)

    def __str__(self):
        return self.content
