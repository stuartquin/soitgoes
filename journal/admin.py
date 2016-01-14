from django.contrib import admin

from .models import Thought, Tag


@admin.register(Thought)
class ThoughtAdmin(admin.ModelAdmin):
    list_display = ('content', 'user', 'created_at')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('tag', 'user', 'created_at')
