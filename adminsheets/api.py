import json

from django.core.exceptions import FieldDoesNotExist
from django.http import HttpResponse
from django.contrib.admin.utils import (
    display_for_field, display_for_value, label_for_field, lookup_field,
)
from adminsheets.sites import admin_sheets


def _get_list_display(model_admin):
    return ['id'] + list(model_admin.list_display)


def _get_choices(field):
    try:
        # TODO Think about making this async
        choices = field.get_choices()
        return [{'value': c[0],  'label': c[1]} for c in choices]
    except AttributeError:
        return None


def fields(request, path):
    model_class, model_admin = admin_sheets.registry.get(path, (None, None))
    model_meta = model_class._meta
    fields = []

    for i, field_name in enumerate(_get_list_display(model_admin)):
        label, attr = label_for_field(
            field_name, model_class,
            model_admin=model_admin,
            return_attr=True
        )

        read_only = field_name in model_admin.readonly_fields
        try:
            field_type = model_meta.get_field(field_name).get_internal_type()
        except FieldDoesNotExist:
            field_type = 'CharField'
            read_only = True

        if not read_only:
            choices = _get_choices(model_meta.get_field(field_name))

        fields.append({
            'label': label,
            'field': field_name,
            'type': field_type,
            'read_only': read_only,
            'choices': choices,
        })

    return HttpResponse(
        json.dumps(fields),
        content_type='application/json'
    )
