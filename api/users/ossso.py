import json
import logging
from typing import Optional

from django.conf import settings
import urllib.request
from urllib.error import HTTPError

logger = logging.getLogger("sso")


def get_saml_response(code: str) -> Optional[dict]:
    try:
        headers = {
            "Authorization": f"Token {settings.OSSSO_API_TOKEN}",
        }
        url = f"{settings.OSSSO_API_URL}/v1/response/{code}/"

        request = urllib.request.Request(url, headers=headers)
        response = urllib.request.urlopen(request)
        return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        logger.error(error)
