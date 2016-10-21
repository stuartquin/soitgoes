from django.core.exceptions import ObjectDoesNotExist

from journal.models import Expense
from datetime import datetime


def get_existing_expense(monzo_id):
    try:
        return Expense.objects.get(monzo_id=monzo_id)
    except ObjectDoesNotExist:
        return None


def import_transaction(transaction):
    amount = transaction['amount']
    if amount >= 0:
        return
    expense = Expense()
    # @TODO need to work out the user-id here
    expense.user_id = 1
    expense.type = transaction['category']
    expense.date = datetime.strptime(
        transaction['created'],
        '%Y-%m-%dT%H:%M:%SZ'
    )
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
