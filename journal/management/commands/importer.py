from django.core.management import BaseCommand

import csv
from datetime import datetime

from journal.models import Invoice, Project, TimeSlip


class Command(BaseCommand):
    # Show this when the user types help
    help = 'Import data from FreeAgent'

    # A command must define handle()
    def handle(self, *args, **options):
        self.project = Project.objects.filter(name=options['project']).first()
        self.importer('Arts Alliance Media')

    def add_arguments(self, parser):
        parser.add_argument('project', type=str)

    def import_invoice(self, data):
        invoice = Invoice()
        invoice.sequence_num = int(data[2][-3:])
        invoice.issued_at = datetime.strptime(data[3], '%d %B %Y')
        invoice.project = self.project
        invoice.save()
        return invoice

    def import_timeslip(self, data, invoice):
        if data[11] == 'Days':
            self.stdout.write('Timeslip')
            date_str = data[14].split(' on ')[1].split(':')[0]
            timeslip = TimeSlip()
            timeslip.hours = float(data[14][:1])
            timeslip.date = datetime.strptime(date_str, '%d %b %y')
            timeslip.invoice = invoice
            timeslip.project = self.project
            timeslip.user_id = 1
            timeslip.save()

    def importer(self, contact_name):
        invoice = None

        with open('/tmp/invoices.csv', 'r') as file:
            reader = csv.reader(file)
            lines = [row for row in reader]

        for line in lines:
            if line[0] == '' and invoice:
                self.import_timeslip(line, invoice)
            else:
                invoice = None

            if line[1] == self.project.name:
                self.stdout.write('Importing..')
                invoice = self.import_invoice(line)
