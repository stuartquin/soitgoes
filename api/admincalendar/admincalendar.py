import json
from datetime import datetime

from django.contrib import admin
from django.contrib.admin.views.main import ChangeList
from django.http import JsonResponse
from django.utils.safestring import mark_safe

ADMIN_CALENDAR_PARAMS = ["start", "end"]


def get_admin_calendar_events(cl):
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

    return admin_events


def register_admincalendar(modeladmin, model):
    class Meta:
        proxy = True
        app_label = model._meta.app_label
        verbose_name = model._meta.verbose_name

    attrs = {"__module__": "", "Meta": Meta}

    newmodel = type(f"{model.__name__}Calendar", (model,), attrs)

    admin.site.register(newmodel, modeladmin)
    return modeladmin


def get_datetime(date_str):
    return datetime.strptime(date_str[0:10], "%Y-%m-%d")


class AdminCalendarChangeList(ChangeList):
    def get_filters_params(self, params=None):
        lookup_params = super().get_filters_params(params)
        if "start" in lookup_params:
            del lookup_params["start"]

        if "end" in lookup_params:
            del lookup_params["end"]

        return lookup_params


class AdminCalendar(admin.ModelAdmin):
    admin_calendar = True

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        start = request.GET.get("start")
        end = request.GET.get("end")

        if start:
            return qs.filter(date__gte=get_datetime(start), date__lte=get_datetime(end))

        return qs

    def changelist_view(self, request, extra_context=None):
        request_get = request.GET.copy()

        template_response = super().changelist_view(request, extra_context) or {}
        context_data = template_response.context_data or {}
        admin_events = get_admin_calendar_events(context_data["cl"])

        if "start" in request_get:
            return JsonResponse(admin_events, safe=False)
        else:
            context_data["calendar_admin_events"] = mark_safe(json.dumps(admin_events))
            template_response.context_data = context_data
            return template_response

    def get_changelist(self, request, **kwargs):
        return AdminCalendarChangeList
