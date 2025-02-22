import re
from datetime import datetime, timedelta, timezone

from django.db.models import QuerySet

from financeapp.models import BankTransaction, Tag
from journal.models import Account, Invoice, Project


def get_start_end_of_day(date: datetime) -> tuple[datetime, datetime]:
    """
    Given a date, return the start and end datetimes for that day
    """
    start_date = datetime(date.year, date.month, date.day, 0, 0, 0, tzinfo=timezone.utc)
    end_date = datetime(
        date.year, date.month, date.day, 23, 59, 59, tzinfo=timezone.utc
    )

    return start_date, end_date


def get_transfer(transaction: BankTransaction, transactions: QuerySet[BankTransaction]):
    """
    Look at all transactions NOT from transaction.bank_account and
    if date/amounts line up then they are likely a transfer
    """

    start_date, end_date = get_start_end_of_day(transaction.date)
    return (
        transactions.filter(
            date__lte=end_date, date__gte=start_date, amount=transaction.amount * -1
        )
        .exclude(bank_account=transaction.bank_account)
        .first()
    )


def get_cleaned_name(name: str):
    return re.sub(r"ltd\.?|limited|pte\.?", "", name.lower()).strip()


def get_matching_project(transaction: BankTransaction, projects: QuerySet[Project]):
    names = [project.name for project in projects]

    transaction_name = transaction.description.lower()
    for project in projects:
        names = [
            project.name.lower(),
        ]
        contact = project.contact
        if contact and contact.name:
            names.append(contact.name.lower())

            if contact.company and contact.company.name:
                names.append(get_cleaned_name(contact.company.name))

        if any(name in transaction_name for name in names):
            return project


def get_matching_invoice(transaction: BankTransaction, invoices: QuerySet[Invoice]):
    if transaction.amount < 0:
        return None

    issued_at = transaction.date - timedelta(days=90)
    invoice = (
        invoices.filter(
            issued_at__gte=issued_at,
            issued_at__lte=transaction.date,
            total_paid=transaction.amount_pounds,
        )
        .order_by("-issued_at")
        .first()
    )
    return invoice


def get_system_tags(
    transaction: BankTransaction,
    projects: QuerySet[Project],
    invoices: QuerySet[Invoice],
):
    invoice = None
    project = None
    tags = []
    if not transaction.tags.filter(tag_type="invoice").exists():
        invoice = get_matching_invoice(transaction, invoices)
        if invoice:
            project = invoice.project
            tags.append(
                Tag(
                    bank_transaction=transaction,
                    tag_type="invoice",
                    value=invoice.pk,
                )
            )

    if not transaction.tags.filter(tag_type="project").exists():
        if not project:
            project = get_matching_project(transaction, projects)

        if project:
            tags.append(
                Tag(
                    bank_transaction=transaction,
                    tag_type="project",
                    value=project.pk,
                )
            )

    return tags


def run_system_rules(account: Account, transactions: QuerySet[BankTransaction]):
    projects = account.project_set.all()
    invoices = Invoice.objects.filter(project__in=projects)
    tags = []

    for transaction in transactions:
        tags = tags + get_system_tags(transaction, projects, invoices)

    Tag.objects.bulk_create(tags)
