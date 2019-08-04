import json

from django.core.exceptions import FieldDoesNotExist
from django.http import HttpResponse
from django.contrib.admin.utils import (
    display_for_field, display_for_value, label_for_field, lookup_field,
)
from adminsheets.sites import admin_sheets


TYPE_MAP = {
    'CharField': 'string',
    'TextField': 'string',
    'FloatField': 'number',
    'IntegerField': 'number',
    'ForeignKey': 'select',
    'DateTimeField': 'date'
}


def _get_list_display(model_admin):
    return ['id'] + list(model_admin.list_display)


def _get_options(field):
    try:
        # TODO Think about making this async
        choices = field.get_choices()
        return [{'value': c[0],  'label': c[1]} for c in choices]
    except AttributeError:
        return None


def _get_field_type(db_type, options):
    if options is not None:
        return 'select'

    return TYPE_MAP.get(db_type, 'string')


def _is_read_only(field_name, model_admin, db_type):
    return (
        field_name in model_admin.readonly_fields or
        db_type == 'AutoField'
    )


def get_fields_definition(model_class, model_admin):
    model_meta = model_class._meta
    fields = []

    for i, field_name in enumerate(_get_list_display(model_admin)):
        label, attr = label_for_field(
            field_name, model_class,
            model_admin=model_admin,
            return_attr=True
        )

        try:
            db_type = model_meta.get_field(field_name).get_internal_type()
            read_only = _is_read_only(field_name, model_admin, db_type)
        except FieldDoesNotExist:
            db_type = 'CharField'
            read_only = True

        if not read_only:
            options = _get_options(model_meta.get_field(field_name))
        else:
            options = None

        fields.append({
            'label': label,
            'field': field_name,
            'field_type': _get_field_type(db_type, options),
            'read_only': read_only,
            'options': options,
        })

    return fields


def fields(request, path):
    model_class, model_admin = admin_sheets.registry.get(path, (None, None))

    return HttpResponse(
        json.dumps(get_fields_definition(model_class, model_admin)),
        content_type='application/json'
    )
