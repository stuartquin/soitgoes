import json
import logging

from django.conf import settings
from django.core.cache import cache
import urllib.request
from urllib.error import HTTPError

logger = logging.getLogger("currency")


def convert_rates_to_gbp(rates: dict[str, float]) -> dict[str, float]:
    gbp_rate = rates["GBP"]
    return {currency: (1.0 / gbp_rate) * rate for currency, rate in rates.items()}


def get_rates() -> dict[str, float]:
    rates = cache.get("open_exhange_rates")

    if not rates:
        try:
            url = f"https://openexchangerates.org/api/latest.json?app_id={settings.OPEN_EXCHANGE_RATES_APP_ID}"
            f = urllib.request.urlopen(url)
            data = json.loads(f.read().decode("utf-8"))
            rates = convert_rates_to_gbp(data.get("rates"))
            cache.set("open_exhange_rates", rates, 60 * 60)
        except HTTPError as error:
            logger.error(error)
            return {"GBP": 1}

    return rates
