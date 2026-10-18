from django.core.management import BaseCommand

from financeapp.csvimport import parse_csv
from financeapp.models import BankAccount


class Command(BaseCommand):
    # Show this when the user types help
    help = "Import data from Bank CSV"

    # A command must define handle()
    def handle(self, *args, **options):
        print(f"{options=}")
        self.importer(
            BankAccount.objects.get(id=options["bank_account"]), options["csv_file"]
        )

    def add_arguments(self, parser):
        parser.add_argument("bank_account", type=str)
        parser.add_argument("csv_file", type=str)

    def importer(self, bank_account, csv_file_path):
        print(f"{bank_account=}")
        with open(csv_file_path, "r") as file:
            parse_csv(bank_account, file)
