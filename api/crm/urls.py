from django.conf.urls import url
from crm import views

urlpatterns = [
    url(r"note/$", views.NoteListCreateView.as_view(), name="notes-list"),
]
