from django.core.management import BaseCommand
from django.core.exceptions import ObjectDoesNotExist
from monzo.monzo import Monzo

import os
import logging
from datetime import datetime

from journal.models import Expense, User

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    # Show this when the user types help
    help = '''
    Import data from Monzo.
    Requires MONZO_ACC and MONZO_TOKEN env variables
    '''

    def add_arguments(self, parser):
        parser.add_argument('user_id', type=int)

    # A command must define handle()
    def handle(self, *args, **options):
        self.acc_no = os.getenv('MONZO_ACC')
        self.access_token = os.getenv('MONZO_TOKEN')
        self.user = User.objects.get(pk=options['user_id'])
        if not self.access_token:
            logger.error('Monzo Access token required')
        else:
            self.importer()

    def importer(self):
        client = Monzo(self.access_token)
        params = {'since': 'tx_00009DPIXSQUPUgJh5j7yL'}
        response = client.get_transactions(self.acc_no, params)
        self.import_transactions(response['transactions'])

    def get_existing_expense(self, monzo_id):
        try:
            return Expense.objects.get(monzo_id=monzo_id)
        except ObjectDoesNotExist:
            return None

    def import_transaction(self, transaction):
        amount = transaction['amount']
        if amount >= 0:
            return
        expense = Expense()
        expense.user = self.user
        expense.type = transaction['category']
        expense.date = datetime.strptime(
            transaction['created'],
            '%Y-%m-%dT%H:%M:%S.%fZ'
        )
        expense.value = transaction['amount'] / 100.0
        expense.monzo_id = transaction['id']
        expense.reference = transaction['description']
        if 'merchant' in transaction and transaction['merchant']:
            merchant = transaction['merchant']
            notes = merchant['name']
            if 'address' in merchant:
                notes += ', ' + merchant['address']['short_formatted']
            expense.notes = notes
        expense.save()

    def import_transactions(self, transactions):
        for transaction in transactions:
            existing = self.get_existing_expense(transaction['id'])
            if existing:
                logger.warning('Expense %s exists' % transaction['id'])
            else:
                self.import_transaction(transaction)
