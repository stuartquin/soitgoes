from datetime import date, timedelta
from django.db.models import Q, F, Sum
from journal.models import (
    Project,
    Task,
    Invoice,
    TaskInvoice,
    TimeSlip,
    BILLING_TYPE_FIXED,
    BILLING_TYPE_TIME,
    TASK_STATUS_DONE,
)


def get_unbilled_summary(projects: list[Project]):
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
            total_cost[project] = total_cost.get(project, 0) + cost

    keys = set(list(hours.keys()) + list(total_cost.keys()))

    return sorted(
        [
            dict(
                project=p,
                hours=hours.get(p.pk, 0),
                total=total_cost.get(p.pk, 0),
                next_sequence_num=Invoice.get_next_sequence_num(p.pk),
            )
            for p in projects
        ],
        key=lambda a: a["total"],
        reverse=True,
    )
