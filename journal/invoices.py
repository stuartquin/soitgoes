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


def _save_invoice_task(invoice, task):
    cost = 0
    if task.billing_type == BILLING_TYPE_FIXED:
        cost = task.cost
    else:
        cost = sum([ts.cost for ts in invoice.timeslips.filter(task=task)])

    task_invoice = TaskInvoice.objects.create(
        task=task,
        invoice=invoice,
        cost=cost
    )
    task_invoice.save()


def save_invoice_tasks(invoice, tasks):
    for task in tasks:
        _save_invoice_task(invoice, task)


def set_invoice_totals(invoice):
    invoice.subtotal_due = float(sum([ti.cost for ti in invoice.taskinvoice_set.all()]))
    invoice.total_due = invoice.subtotal_due + invoice.get_modifier_value(invoice.subtotal_due)
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
