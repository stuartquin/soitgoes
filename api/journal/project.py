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


def get_unbilled_summary(start_date=None, end_date=None):
    task_costs = (
        Task.objects.filter(billing_type=BILLING_TYPE_FIXED, invoices=None)
        .exclude(state=TASK_STATUS_DONE)
        .values("project")
        .annotate(cost=Sum("cost"))
    )
    time_query = TimeSlip.objects.filter(
        invoice=None, task__billing_type=BILLING_TYPE_TIME,
    )

    if start_date:
        time_query = time_query.filter(date__gte=start_date)

    if end_date:
        time_query = time_query.filter(date__lt=end_date)

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

    return [
        dict(project=p, hours=hours.get(p, 0), total=total_cost.get(p, 0)) for p in keys
    ]
