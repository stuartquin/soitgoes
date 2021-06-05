from django.urls import include, path
from django.views.generic import TemplateView
from users import views

urlpatterns = [
    path(r"login/", views.LoginView.as_view(), name="users_login"),
    path(r"token/", views.OneTimeTokenView.as_view(), name="ine_time_token_view"),
    path(r"", views.LoggedInUserView.as_view(), name="users_logged_in_user"),
]
