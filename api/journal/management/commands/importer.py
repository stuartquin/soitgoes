from django.core.management import BaseCommand

import csv
from datetime import datetime

from journal.models import Invoice, Project, TimeSlip, InvoiceItem


class Command(BaseCommand):
    # Show this when the user types help
    help = 'Import data from FreeAgent'

    # A command must define handle()
    def handle(self, *args, **options):
        self.importer(Project.objects.filter(name=options['project']).first())

    def add_arguments(self, parser):
        parser.add_argument('project', type=str)

    def import_invoice(self, project, data):
        invoice = Invoice()
        invoice.sequence_num = int(data[2][-3:])
        invoice.issued_at = datetime.strptime(data[3], '%d %B %Y')
        invoice.paid_at = invoice.issued_at
        invoice.project = project
        invoice.total_paid = data[8]
        invoice.total_due = data[8]
        invoice.subtotal_due = data[8]
        invoice.save()
        return invoice

    def import_timeslip(self, project, data, invoice):
        if data[11] == 'Days':
            self.stdout.write('Timeslip')
            date_str = data[14].split(' on ')[1].split(':')[0]
            timeslip = TimeSlip()
            timeslip.hours = float(data[14][:1])
            timeslip.date = datetime.strptime(date_str, '%d %b %y')
            timeslip.invoice = invoice
            timeslip.project = project
            timeslip.user_id = 1
            timeslip.save()

        if data[11] == 'Services':
            item = InvoiceItem()
            item.name = data[14].strip()
            item.cost_per_unit = data[13]
            item.units = data[11]
            item.qty = 1
            item.invoice = invoice
            item.save()

    def importer(self, project):
        invoice = None

        with open('/tmp/invoices.csv', 'r') as file:
            reader = csv.reader(file)
            lines = [row for row in reader]

        for line in lines:
            if line[0] == '' and invoice:
                self.import_timeslip(project, line, invoice)
            else:
                invoice = None

            if line[1] == project.name:
                invoice = self.import_invoice(project, line)
