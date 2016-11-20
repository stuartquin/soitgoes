from datetime import datetime, date
from dateutil.relativedelta import relativedelta

from . import models
from . import serializers


def get_empty_date_collection(from_date, to_date):
    dates = {}
    format = '%Y-%m-%d'
    current = from_date
    while current < to_date:
        start = date(current.year, current.month, 1)
        dates[start.strftime(format)] = {
            'issued': [],
            'paid': []
        }
        current = current + relativedelta(months=1)

    return dates


def invoice_summary_monthly(start_date, end_date):
    format = '%Y-%m-%d'
    from_date = datetime.strptime(start_date, format)
    to_date = datetime.strptime(end_date, format)
    dates = get_empty_date_collection(from_date, to_date)

    issued = models.Invoice.objects.filter(
        issued_at__gt=from_date,
        issued_at__lt=to_date
    )
    paid = models.Invoice.objects.filter(
        paid_at__gt=from_date,
        paid_at__lt=to_date
    )

    for invoice in issued:
        issued_at = invoice.issued_at
        d = date(issued_at.year, issued_at.month, 1).strftime(format)
        dates[d]['issued'].append(
            serializers.InvoiceSerializer(invoice).data
        )

    for invoice in paid:
        paid_at = invoice.paid_at
        d = date(paid_at.year, paid_at.month, 1).strftime(format)
        dates[d]['paid'].append(
            serializers.InvoiceSerializer(invoice).data
        )

    return dates
