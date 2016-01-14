from django.contrib import admin

from .models import Thought, Tag

admin.site.register(Thought)
admin.site.register(Tag)
