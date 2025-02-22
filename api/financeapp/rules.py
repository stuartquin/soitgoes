import operator
import re
from datetime import datetime, timedelta, timezone
from functools import reduce
from typing import TypedDict

from django.db.models import Q, QuerySet

from financeapp.models import BankTransaction, Rule, Tag
from journal.models import Account, Invoice, Project


class Condition(TypedDict, total=False):
    field: str
    operator: str
    value: str
    AND: list["Condition"]
    OR: list["Condition"]


class TagDefinition(TypedDict):
    tag_type: str
    value: str


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
    all_transactions: QuerySet[BankTransaction],
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
                    bank_transaction_id=transaction.pk,
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
                    bank_transaction_id=transaction.pk,
                    tag_type="project",
                    value=project.pk,
                )
            )

    if not transaction.tags.filter(tag_type="transfer").exists():
        transfer_transaction = get_transfer(transaction, all_transactions)
        if transfer_transaction:
            tags.append(
                Tag(
                    bank_transaction_id=transaction.pk,
                    tag_type="transfer",
                    value=transfer_transaction.bank_account.pk,
                    meta={"bank_transaction": transfer_transaction.pk},
                )
            )

    return tags


def run_system_rules(account: Account, transactions: QuerySet[BankTransaction]):
    projects = account.project_set.all()
    invoices = Invoice.objects.filter(project__in=projects)
    tags = []

    all_transactions = BankTransaction.objects.filter(
        bank_account__in=account.bank_accounts.all()
    )

    for transaction in transactions:
        tags = tags + get_system_tags(transaction, projects, invoices, all_transactions)

    Tag.objects.bulk_create(tags)


def parse_conditions(conditions: Condition) -> Q:
    """
    Parses a dictionary of conditions and returns a Django Q object.
    Supports "AND" and "OR" logical operators, and "contains" operator for string fields
    """
    if "AND" in conditions:
        return reduce(
            operator.and_,
            (parse_conditions(condition) for condition in conditions["AND"]),
        )
    elif "OR" in conditions:
        return reduce(
            operator.or_,
            (parse_conditions(condition) for condition in conditions["OR"]),
        )
    elif "field" in conditions and "operator" in conditions and "value" in conditions:
        field = conditions["field"]
        operator_name = conditions["operator"]
        value = conditions["value"]

        if operator_name == "contains":
            return Q(**{f"{field}__icontains": value})
        elif operator_name == "exact":
            return Q(**{field: value})
        elif operator_name == "gt":
            return Q(**{f"{field}__gt": value})
        elif operator_name == "lt":
            return Q(**{f"{field}__lt": value})
        elif operator_name == "gte":
            return Q(**{f"{field}__gte": value})
        elif operator_name == "lte":
            return Q(**{f"{field}__lte": value})
        else:
            raise ValueError(f"Unsupported operator: {operator_name}")

    return Q()


def run_rule(
    rule: Rule,
    transactions: QuerySet[BankTransaction],
):
    matched_transactions = transactions.filter(parse_conditions(rule.conditions))

    tags = []
    for transaction in matched_transactions:
        for tag_definition in rule.tag_definitions:
            tags.append(
                Tag(
                    bank_transaction_id=transaction.pk,
                    rule=rule,
                    tag_type=tag_definition["tag_type"],
                    value=tag_definition["value"],
                )
            )

    Tag.objects.bulk_create(tags)
