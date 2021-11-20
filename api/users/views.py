from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from django.shortcuts import render
from django.contrib.auth import login as django_login

from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from django_filters.rest_framework import DjangoFilterBackend

from users.serializers import (
    LoginSerializer,
    SSOSerializer,
    UserSerializer,
    OneTimeTokenSerializer,
)
from users.models import OneTimeToken
from users.filters import SSOFilter
from users.ossso import get_saml_response

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
        code = request.data.get("code")
        saml_response = get_saml_response(code)
        email = saml_response.get("user_name")

        print("SAML", email)

        user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
        token, _ = Token.objects.get_or_create(user=user)
        serializer = self.get_serializer(data={"code": code, "token": token.key})

        serializer.is_valid()
        print(serializer.errors)

        backend = getattr(user, "backend", "django.contrib.auth.backends.ModelBackend")
        django_login(request, user, backend)

        headers = self.get_success_headers(serializer.data)
        return Response(
            {"token": token.key}, status=status.HTTP_201_CREATED, headers=headers
        )


class LoggedInUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class OneTimeTokenView(generics.RetrieveAPIView):
    serializer_class = OneTimeTokenSerializer

    def get_object(self):
        token, _ = OneTimeToken.objects.get_or_create(user=self.request.user)
        return token
