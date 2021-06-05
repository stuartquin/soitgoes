from django.contrib.auth.models import Group, User
from rest_framework import authentication
from rest_framework import exceptions

from users.models import OneTimeToken


class OneTimeTokenAccess(authentication.BaseAuthentication):
    def authenticate(self, request):
        key = request.GET.get("token")
        if not key:
            raise exceptions.AuthenticationFailed("No such user")

        try:
            token = OneTimeToken.objects.get(key=key)
            user = token.user
            token.delete()
        except OneTimeToken.DoesNotExist:
            raise exceptions.AuthenticationFailed("No such user")

        return (user, None)
