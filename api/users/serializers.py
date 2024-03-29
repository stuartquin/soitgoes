from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers

from users.models import OneTimeToken

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=300, required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)
    token = serializers.SerializerMethodField(read_only=True)

    def get_token(self, initial_data):
        user = authenticate(
            username=initial_data.get("email"),
            password=initial_data.get("password"),
        )
        if user is None:
            raise serializers.ValidationError(
                "Invalid username/password. Please try again!"
            )

        try:
            return user.auth_token.key
        except User.auth_token.RelatedObjectDoesNotExist:
            raise serializers.ValidationError(
                "Invalid username/password. Please try again!"
            )


class SSOSerializer(serializers.Serializer):
    code = serializers.CharField(required=True, write_only=True)
    token = serializers.CharField(read_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "last_login"]


class OneTimeTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneTimeToken
        fields = ["key"]


class SSORedirectSerializer(serializers.Serializer):
    redirect_url = serializers.CharField(read_only=True)
