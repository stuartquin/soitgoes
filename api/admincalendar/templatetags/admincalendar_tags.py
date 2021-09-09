import json
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def calendar_admin_events(cl):
    if not hasattr(cl.model_admin, "admin_calendar_fields"):
        return "[]"

    admin_fields = cl.model_admin.admin_calendar_fields

    admin_events = []
    for item in cl.result_list:
        for field in admin_fields:
            start_date = getattr(item, field["start"])

            if "title" in field:
                title = getattr(item, field["title"])
            else:
                title = str(item)

            event = {
                "start": start_date.isoformat(),
                "title": title,
                "color": field.get("color"),
                "url": cl.url_for_result(item),
            }

            if field.get("end"):
                event["end"] = getattr(item, field["end"]).isoformat()

            admin_events.append(event)

    return mark_safe(json.dumps(admin_events))


@register.simple_tag
def is_calendar_admin(cl):
    return hasattr(cl.model_admin, "admin_calendar_fields")


@register.simple_tag
def calendar_admin_prev(cl):
    return cl.get_query_string({"calendar_date": "2021-01-01"})
