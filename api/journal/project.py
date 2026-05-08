from datetime import date, timedelta
from django.db.models import Q, F, QuerySet, Sum, Count, Value
from django.db.models.functions import Coalesce
from journal.models import (
    Project,
    Task,
    Invoice,
    TimeSlip,
    BILLING_TYPE_FIXED,
    BILLING_TYPE_TIME,
    TASK_STATUS_DONE,
)

def get_previous_invoice_summary(project: Project):
    invoice = project.invoice_set.last()
    if not invoice:
        return None

    return {
        "reference": invoice.reference,
        "show_hours": invoice.show_hours,
        "billing_unit": invoice.billing_unit,
    }


def get_unbilled_summary(projects: QuerySet[Project]):
    task_costs = (
        Task.objects.filter(
            billing_type=BILLING_TYPE_FIXED, invoices=None, project__in=projects
        )
        .exclude(state=TASK_STATUS_DONE)
        .values("project")
        .annotate(cost=Sum("cost"))
    )
    time_query = TimeSlip.objects.filter(
        invoice=None, task__billing_type=BILLING_TYPE_TIME, project__in=projects
    )

    time_costs = time_query.values("project").annotate(
        cost=Sum(F("hours") * F("hourly_rate")), hours=Sum("hours")
    )

    total_cost = {}
    hours = {}
    for item in task_costs:
        cost = item["cost"]
        if cost > 0:
            total_cost[item["project"]] = total_cost.get(item["project"], 0) + cost

    for item in time_costs:
        project = item["project"]
        cost = item["cost"]
        hours[project] = hours.get(project, 0) + item["hours"]
        if cost > 0:
            total_cost[project] = float(total_cost.get(project, 0)) + float(cost)

    return sorted(
        [
            dict(
                project=p,
                hours=hours.get(p.pk, 0),
                total=total_cost.get(p.pk, 0),
                next_sequence_num=Invoice.get_next_sequence_num(p.pk),
                previous_invoice=p.invoice_set.last()
            )
            for p in projects
        ],
        key=lambda a: a["total"],
        reverse=True,
    )


def _get_totals(key, r):
    invoiced = r[key].get("total_invoiced", 0) or 0
    paid = r[key].get("total_paid", 0) or 0
    count = r[key].get("invoice_count", 0)
    return invoiced, paid, invoiced - paid, count


def get_invoices_summary(projects: QuerySet[Project], status: str | None = None):
    six_months_ago = date.today() - timedelta(days=182)

    base_filters: dict = {"project__in": projects}
    if status:
        base_filters["status"] = status

    all_results = (
        Invoice.objects.filter(**base_filters)
        .values("project")
        .annotate(
            total_invoiced=Coalesce(Sum("total_due"), Value(0.0)),
            total_paid=Coalesce(Sum("total_paid"), Value(0.0)),
            invoice_count=Count("id"),
        )
    )

    recent_results = (
        Invoice.objects.filter(**base_filters, issued_at__gte=six_months_ago)
        .values("project")
        .annotate(
            total_invoiced=Coalesce(Sum("total_due"), Value(0.0)),
            total_paid=Coalesce(Sum("total_paid"), Value(0.0)),
            invoice_count=Count("id"),
        )
    )

    totals = {r["project"]: r for r in all_results}
    recent = {r["project"]: r for r in recent_results}
    empty = {"total_invoiced": 0, "total_paid": 0, "invoice_count": 0}

    def _safe(lookup, pk):
        return lookup.get(pk, empty)

    return sorted(
        [
            dict(
                project=p,
                total_invoiced=_safe(totals, p.pk)["total_invoiced"],
                total_paid=_safe(totals, p.pk)["total_paid"],
                total_unpaid=(_safe(totals, p.pk)["total_invoiced"] or 0) - (_safe(totals, p.pk)["total_paid"] or 0),
                invoice_count=_safe(totals, p.pk)["invoice_count"],
                six_month_total_invoiced=_safe(recent, p.pk)["total_invoiced"],
                six_month_total_paid=_safe(recent, p.pk)["total_paid"],
                six_month_total_unpaid=(_safe(recent, p.pk)["total_invoiced"] or 0) - (_safe(recent, p.pk)["total_paid"] or 0),
                six_month_invoice_count=_safe(recent, p.pk)["invoice_count"],
            )
            for p in projects
        ],
        key=lambda a: a["total_invoiced"],
        reverse=True,
    )
