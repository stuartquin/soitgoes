import json
import logging
import urllib.request
from typing import Optional

from django.conf import settings
from django.contrib import auth
from django.shortcuts import get_object_or_404
from urllib.error import HTTPError

from rest_framework.authtoken.models import Token
from journal.models import Account

logger = logging.getLogger("sso")

User = auth.get_user_model()


class OSSSOException(Exception):
    pass


def get_json(url: str) -> dict:
    try:
        headers = {
            "Authorization": f"Token {settings.OSSSO_API_TOKEN}",
        }

        print(f"{headers=}")
        request = urllib.request.Request(url, headers=headers)
        response = urllib.request.urlopen(request)
        return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        logger.error(error)
        raise error


def get_saml_response(code: str) -> Optional[dict]:
    return get_json(f"{settings.OSSSO_API_URL}/v1/response/{code}")


def get_sso_account(email: str) -> Account:
    domain = email.split("@")[1]
    return get_object_or_404(Account, sso_domain=domain)


def get_sso_redirect_url(domain: str) -> str:
    try:
        response = get_json(
            f"{settings.OSSSO_API_URL}/v1/connection/url?domain={domain}"
        )

    except HTTPError:
        raise OSSSOException("Unable to establish OSSSO connection")
    return response["redirect_url"]


def perform_sso_login(code: str) -> User:
    saml_response = get_saml_response(code)

    if not saml_response:
        raise OSSSOException(f"Invalid code {code}")

    email = saml_response.get("user_name")

    if not email:
        raise OSSSOException(f"Invalid SAML Response {code}")

    user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
    account = get_sso_account(email)
    account.users.add(user)
    Token.objects.get_or_create(user=user)
    return user
