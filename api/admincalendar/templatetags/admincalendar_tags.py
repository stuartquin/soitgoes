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
            title = getattr(item, field["title"])

            event = {
                "start": start_date.isoformat(),
                "title": title,
                "color": field.get("color"),
            }
            admin_events.append(event)

    return mark_safe(json.dumps(admin_events))


@register.simple_tag
def is_calendar_admin(cl):
    print("IS CAL ADD", hasattr(cl.model_admin, "admin_calendar_fields"))
    return hasattr(cl.model_admin, "admin_calendar_fields")
