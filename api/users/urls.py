from django.urls import include, path
from django.views.generic import TemplateView
from users import views

urlpatterns = [
    path(r"sso/", views.SSOView.as_view(), name="users_sso"),
    path(r"sso/redirect/", views.sso_redirect, name="users_sso_redirect"),
    path(r"login/", views.LoginView.as_view(), name="users_login"),
    path(r"token/", views.OneTimeTokenView.as_view(), name="ine_time_token_view"),
    path(r"", views.LoggedInUserView.as_view(), name="users_logged_in_user"),
]
