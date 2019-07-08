from datetime import date, timedelta
from journal.models import (
    Task, Invoice, TaskInvoice, TimeSlip, TASK_STATUS_OPEN
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
    timeslips = [
        t[0] for t in TimeSlip.objects.filter(
            project_id=project_id,
            invoice=None
        ).values_list('pk')
    ]
    tasks = [
        t[0] for t in Task.objects.filter(
            project_id=project_id,
            state=TASK_STATUS_OPEN,
        ).values_list('pk')
    ]

    return {
        'project': project_id,
        'tasks': tasks,
        'timeslips': timeslips,
        'items': [],
        'modifiers': [],
        'due_date': due_date.strftime('%Y-%m-%d')
    }
