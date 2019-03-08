from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import authentication
from rest_framework import exceptions

class CookieAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        key = request.COOKIES.get('TOKEN')
        if not key:
            raise exceptions.AuthenticationFailed('No such user')

        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        return (token.user, None)
