from typing import cast
from django.conf import settings
from django.http.response import HttpResponse

from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from django.shortcuts import redirect
from django.contrib.auth import login as django_login
from django_filters.rest_framework.backends import DjangoFilterBackend

from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from users.serializers import (
    LoginSerializer,
    SSORedirectSerializer,
    SSOSerializer,
    UserSerializer,
    OneTimeTokenSerializer,
)
from users.models import OneTimeToken
from users.ossso import (
    OSSSOException,
    get_saml_response,
    get_sso_redirect_url,
    perform_sso_login,
)

# Create your views here.
User = auth.get_user_model()


class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    @csrf_exempt
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class SSOView(generics.CreateAPIView):
    serializer_class = SSOSerializer
    permission_classes = [AllowAny]

    @csrf_exempt
    def create(self, request, *args, **kwargs):
        try:
            user = perform_sso_login(request.data.get("code"))
            backend = getattr(
                user, "backend", "django.contrib.auth.backends.ModelBackend"
            )
            django_login(request, user, backend)
            headers = self.get_success_headers({})
            return Response(
                {"token": user.auth_token.key},
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        except OSSSOException:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def sso_redirect(request: Request) -> HttpResponse:
    try:
        print(request.GET)
        redirect_url = get_sso_redirect_url(request.GET.get("domain", ""))
    except OSSSOException:
        return redirect("/")

    return redirect(redirect_url)


class LoggedInUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class OneTimeTokenView(generics.RetrieveAPIView):
    serializer_class = OneTimeTokenSerializer

    def get_object(self):
        token, _ = OneTimeToken.objects.get_or_create(user=self.request.user)
        return token
