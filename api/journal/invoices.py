from datetime import date, timedelta
from django.db.models import Q, F, Sum
from journal.models import (
    Task,
    Invoice,
    TaskInvoice,
    TimeSlip,
    BILLING_TYPE_FIXED,
    BILLING_TYPE_TIME,
    TASK_STATUS_DONE,
)


def _save_invoice_timeslip(invoice, item):
    timeslip = TimeSlip.objects.get(pk=item.get("id"))
    timeslip.invoice = invoice
    timeslip.save()


def _save_invoice_task(invoice, task):
    if task.billing_type == BILLING_TYPE_FIXED:
        cost = task.cost
        hours_spent = 0
    else:
        cost = sum([ts.cost for ts in invoice.timeslips.filter(task=task)])
        hours_spent = sum([ts.hours for ts in invoice.timeslips.filter(task=task)])

    task_invoice = TaskInvoice.objects.create(
        task=task, invoice=invoice, cost=cost, hours_spent=hours_spent
    )
    task_invoice.save()


def save_invoice_tasks(invoice, tasks):
    for task in tasks:
        _save_invoice_task(invoice, task)


def set_invoice_totals(invoice):
    invoice.subtotal_due = float(sum([ti.cost for ti in invoice.taskinvoice_set.all()]))
    invoice.total_due = invoice.subtotal_due + invoice.get_modifier_value(
        invoice.subtotal_due
    )
    invoice.save()


def get_new_invoice(project_id):
    due_date = date.today() + timedelta(days=14)
    timeslips = TimeSlip.objects.filter(
        project_id=project_id, invoice=None, task__billing_type=BILLING_TYPE_TIME,
    ).values_list("pk", "task_id")

    if len(timeslips):
        timeslip_ids, timeslip_task_ids = zip(*timeslips)
    else:
        timeslip_ids = []
        timeslip_task_ids = []

    task_ids = [
        t[0]
        for t in Task.objects.filter(project_id=project_id,)
        .filter(
            Q(billing_type=BILLING_TYPE_FIXED, completed_at=None)
            | Q(pk__in=timeslip_task_ids)
        )
        .values_list("pk")
    ]

    return {
        "project": project_id,
        "tasks": task_ids,
        "timeslips": timeslip_ids,
        "items": [],
        "modifier": [],
        "due_date": due_date.strftime("%Y-%m-%d"),
        "group_by": "timeslips",
        "show_hours": True,
    }


def get_upcoming_invoices():
    task_costs = (
        Task.objects.filter(billing_type=BILLING_TYPE_FIXED, invoices=None)
        .exclude(state=TASK_STATUS_DONE)
        .values("project")
        .annotate(cost=Sum("cost"))
    )
    time_costs = (
        TimeSlip.objects.filter(invoice=None, task__billing_type=BILLING_TYPE_TIME,)
        .values("project")
        .annotate(cost=Sum(F("hours") * F("hourly_rate")), hours=Sum("hours"))
    )

    grouped = {}
    hours = {}
    for item in task_costs:
        cost = item["cost"]
        if cost > 0:
            grouped[item["project"]] = grouped.get(item["project"], 0) + cost

    for item in time_costs:
        project = item["project"]
        cost = item["cost"]
        hours[project] = hours.get(project, 0) + item["hours"]
        if cost > 0:
            grouped[project] = grouped.get(project, 0) + cost

    return grouped, hours
