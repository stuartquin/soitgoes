from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from users.serializers import LoginSerializer, UserSerializer, OneTimeTokenSerializer
from users.models import OneTimeToken

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


class LoggedInUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class OneTimeTokenView(generics.RetrieveAPIView):
    serializer_class = OneTimeTokenSerializer

    def get_object(self):
        token, _ = OneTimeToken.objects.get_or_create(user=self.request.user)
        return token
