import re
from datetime import datetime
import io
import csv
import hashlib
from typing import Union

from samples import METRO, MONZO, NATWEST, SANTANDER, STARLING


DATE_COLS = ["date"]
BALANCE_COLS = ["balance"]
AMOUNT_COLS = ["value", "amount", ("in", "out"), ("money in", "money out")]
UNIQUE_ID_COLS = ["transaction id"]
DESCRIPTION_COLS = ["name", "description", "counter party", "reference", "details"] # Concat multiple?
ADDITIONAL_COLS = ["address", "category", "description","currency", "type", "time"]
TYPE_COLS = ["type", "transaction type",]

COLUMNS = {
    "date": DATE_COLS,
    "balance": BALANCE_COLS,
    "amount": AMOUNT_COLS,
    "description": DESCRIPTION_COLS,
    "type": TYPE_COLS
}

HASH_KEYS=["account_id", "date", "amount","type"]



def parse_date(row: dict[str, str]):
    value = None
    for key in DATE_COLS:
        if key in row:
            value = row[key]

    if not value:
        return None

    formats = [
        "%Y-%m-%d",  # YYYY-MM-DD
        "%Y/%m/%d",  # YYYY/MM/DD
        "%m-%d-%Y",  # MM-DD-YYYY
        "%m/%d/%Y",  # MM/DD/YYYY
        "%d-%m-%Y",  # DD-MM-YYYY
        "%d/%m/%Y",  # DD/MM/YYYY
        "%Y%m%d",    # YYYYMMDD
        "%b %d, %Y", # Mon DD, YYYY (e.g., Jan 01, 2024)
        "%B %d, %Y", # Month DD, YYYY (e.g., January 01, 2024)
        "%d %b %Y", # DD Mon YYYY
        "%d %B %Y",  # DD Month YYYY
        "%Y-%m-%d %H:%M:%S",  # YYYY-MM-DD HH:MM:SS
        "%Y/%m/%d %H:%M:%S", # YYYY/MM/DD HH:MM:SS
        "%m-%d-%Y %H:%M:%S", # MM-DD-YYYY HH:MM:SS
         "%m/%d/%Y %H:%M:%S", # MM/DD/YYYY HH:MM:SS
        "%d-%m-%Y %H:%M:%S", # DD-MM-YYYY HH:MM:SS
        "%d/%m/%Y %H:%M:%S", # DD/MM/YYYY HH:MM:SS
        "%Y%m%d%H%M%S",  # YYYYMMDDHHMMSS
        "%b %d, %Y %H:%M:%S", # Mon DD, YYYY HH:MM:SS
        "%B %d, %Y %H:%M:%S", # Month DD, YYYY HH:MM:SS
        "%d %b %Y %H:%M:%S", # DD Mon YYYY HH:MM:SS
        "%d %B %Y %H:%M:%S",  # DD Month YYYY HH:MM:SS
    ]

    for fmt in formats:
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            pass 

    return None


def parse_currency_to_pence(currency_string):
    if not isinstance(currency_string, str):  # Check input type
        return currency_string

    # Remove currency symbols, thousands separators, and whitespace
    cleaned_string = re.sub(r"[£$€¥₹, ]", "", currency_string).strip()

    try:
      # Handle decimal point if present and convert to pence
      if "." in cleaned_string:
          pence = int(float(cleaned_string) * 100)
          # pence = int(dollars) * 100 + int(cents) if len(cents) == 2 else int(dollars) * 100 + int(cents) * 10 if len(cents) == 1 else None #handles cases where there are 1 or 2 digits after the decimal point
          if pence is None:
            return None
      else:
          pence = int(cleaned_string) * 100
      return pence

    except ValueError:
        print(f"{currency_string=} {cleaned_string=}")
        return None  # Invalid numeric format



def parse_currency_value(row: dict[str, str], cols: list[str]):
    value = None
    col_key = None
    for key in cols:
        if key in row or key[0] in row:
            col_key = key

    if not col_key:
        return None

    if type(col_key) is tuple and col_key[0] in row and col_key[1] in row:
        # In
        if row[col_key[0]]:
            value = str(row[col_key[0]])
        elif row[col_key[1]]:
            value = str(0 - abs(float(row[col_key[1]])))

    if type(col_key) is str:
        value = row[col_key]

    if value:
        return parse_currency_to_pence(value)

    return value


def parse_description(row: dict[str, str]):
    value = []
    for key in DESCRIPTION_COLS:
        if key in row:
            value.append(row[key])

    return ", ".join(value) if value else None

def parse_type(row: dict[str, str]):
    for key in TYPE_COLS:
        if key in row:
            return row[key]


def get_cleaned_keys(row: dict[str, str]) -> dict[str, str]:
    lowered = {}
    for key, value in row.items():
        if key:
            lowered[re.sub(r"\s*\(.*?\)\s*", " ", key.lower()).strip()] = value
    return lowered


def parse_unique_id(row: dict[str, str]):
    for key in UNIQUE_ID_COLS:
        if key in row:
            return row[key]

    return generate_hash_id(row, HASH_KEYS)

def generate_hash_id(row: dict[str, str], hash_keys: list[str]) -> str:
    """
    Generates an MD5 hash from the values in a dictionary based on the provided keys.

    Args:
        row (dict[str, str]): The dictionary containing the data.
        hash_keys (list[str]): A list of keys to use for generating the hash.

    Returns:
        str: The hexadecimal representation of the MD5 hash.
    """
    text = "".join(str(row[key]) for key in hash_keys if key in row and row[key])
    hash_object = hashlib.md5(text.encode())
    return hash_object.hexdigest()

def parse_csv(account: str, content: str):
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)

    for row in rows:
        item: dict[str, Union[str, None, int, datetime]] = {
            "account_id": account
        }
        lowered_keys = get_cleaned_keys(row)
        item["id"] = parse_unique_id(lowered_keys)
        item["date"] = parse_date(lowered_keys)
        item["amount"] = parse_currency_value(lowered_keys, AMOUNT_COLS)
        item["description"] = parse_description(lowered_keys)
        item["type"] = parse_type(lowered_keys)
        item["balance"] = parse_currency_value(lowered_keys, BALANCE_COLS)

        print(f"{item=}")
        if item["amount"] is None:
            print(row)


print("Natwest")
parse_csv("natwest",NATWEST)
print("Monzo")
parse_csv("monzo",MONZO)
print("Metro")
parse_csv("metro", METRO)
print("Santander")
parse_csv("santander", SANTANDER)
print("Starling")
parse_csv("starling", STARLING)
