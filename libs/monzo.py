import os
import logging
from django.core.exceptions import ObjectDoesNotExist

from journal.models import Expense
from datetime import datetime

MONZO_ACC = os.getenv('MONZO_ACC')

logger = logging.getLogger(__name__)


def get_existing_expense(monzo_id):
    try:
        return Expense.objects.get(monzo_id=monzo_id)
    except ObjectDoesNotExist:
        return None


def import_transaction(transaction):
    if MONZO_ACC != transaction['account_id']:
        return None

    amount = transaction['amount']
    if amount >= 0:
        return None

    expense = Expense()
    # @TODO need to work out the user-id here
    expense.user_id = 1
    expense.type = transaction['category']

    created = transaction['created']
    try:
        expense.date = datetime.strptime(created, '%Y-%m-%dT%H:%M:%S.%fZ')
    except ValueError:
        logger.error('Unrecognised date format: %s' % created)

    expense.value = transaction['amount'] / 100.0
    expense.monzo_id = transaction['id']
    expense.reference = transaction['description']
    if 'merchant' in transaction and transaction['merchant']:
        merchant = transaction['merchant']
        notes = merchant['name']
        if 'address' in merchant:
            notes += ', ' + merchant['address'].get('short_formatted', '')
        expense.notes = notes

    return expense
