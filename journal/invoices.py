from datetime import date, timedelta
from django.db.models import Q
from journal.models import (
    Task, Invoice, TaskInvoice, TimeSlip, TASK_STATUS_REJECTED,
    BILLING_TYPE_FIXED
)

def _save_invoice_timeslip(invoice, item):
    timeslip = TimeSlip.objects.get(pk=item.get('id'))
    timeslip.invoice = invoice
    timeslip.save()


def _save_invoice_task(invoice, item):
    task_invoice = TaskInvoice.objects.create(
        task=Task.objects.get(pk=item.get('id')),
        invoice=invoice,
        cost=item.get('subTotal')
    )
    task_invoice.save()

    for sub_item in item.get('subItems', []):
        _save_invoice_timeslip(invoice, sub_item)



def save_invoice_items(invoice, items):
    for item in items:
        item_type = item.get('itemType')

        if item_type == 'tasks':
            _save_invoice_task(invoice, item)

        if item_type == 'timeslips':
            _save_invoice_timeslip(invoice, item)

    invoice.save()


def get_new_invoice(project_id):
    due_date = date.today() + timedelta(days=14)
    timeslip_ids, timeslip_task_ids = zip(*
        TimeSlip.objects.filter(
            project_id=project_id,
            invoice=None
        ).values_list('pk', 'task_id')
    )
    task_ids = [
        t[0] for t in Task.objects.filter(
            project_id=project_id,
        ).filter(
            Q(billing_type=BILLING_TYPE_FIXED) | Q(pk__in=timeslip_task_ids)
        ).exclude(
            state=TASK_STATUS_REJECTED,
        ).values_list('pk')
    ]

    return {
        'project': project_id,
        'tasks': task_ids,
        'timeslips': timeslip_ids,
        'items': [],
        'modifiers': [],
        'due_date': due_date.strftime('%Y-%m-%d'),
        'group_by': 'timeslips',
        'show_hours': True,
    }
