from datetime import datetime, date
from dateutil.relativedelta import relativedelta

from . import models
from . import serializers


def get_empty_date_collection(key, from_date, to_date):
    dates = {}
    format = '%Y-%m-%d'
    current = from_date
    while current < to_date:
        start = date(current.year, current.month, 1)
        d = start.strftime(format)
        dates[d] = {}
        dates[d][key] = []
        current = current + relativedelta(months=1)

    return dates


def expense_summary_monthly(start_date, end_date):
    format = '%Y-%m-%d'
    from_date = datetime.strptime(start_date, format)
    to_date = datetime.strptime(end_date, format)
    dates = get_empty_date_collection('items', from_date, to_date)

    expenses = models.Expense.objects.filter(
        date__gte=from_date,
        date__lte=to_date
    )

    for expense in expenses:
        d = date(expense.date.year, expense.date.month, 1).strftime(format)
        dates[d]['items'].append(
            serializers.ExpenseSerializer(expense).data
        )
    return dates


def invoice_summary_monthly(start_date, end_date):
    format = '%Y-%m-%d'
    from_date = datetime.strptime(start_date, format)
    to_date = datetime.strptime(end_date, format)
    dates = get_empty_date_collection('items', from_date, to_date)

    paid = models.Invoice.objects.filter(
        issued_at__gte=from_date,
        issued_at__lte=to_date,
        paid_at__isnull=False
    )

    for invoice in paid:
        issued_at = invoice.issued_at
        d = date(issued_at.year, issued_at.month, 1).strftime(format)
        dates[d]['items'].append(
            serializers.InvoiceSerializer(invoice).data
        )

    return dates
