from django.urls import path
from crm import views

urlpatterns = [
    path(r"note/", views.NoteListCreateView.as_view(), name="notes-list"),
]
