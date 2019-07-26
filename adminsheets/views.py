import json
from django.shortcuts import render
from django.contrib.admin.utils import (
    display_for_field, display_for_value, label_for_field, lookup_field,
)
from adminsheets.sites import admin_sheets


def _get_column_def(model_class, model_admin):
    column_def = []

    for i, field_name in enumerate(model_admin.list_display):
        text, attr = label_for_field(
            field_name, model_class,
            model_admin=model_admin,
            return_attr=True
        )
        column_def.append({
            'headerName': text,
            'field': field_name,
            'editable': True,
        })

    return column_def


def _get_results(model_class, model_admin, queryset):
    rows = []
    empty_value_display = model_admin.get_empty_value_display()
    for result in queryset:
        row = {}
        for field_name in model_admin.list_display:
            f, attr, value = lookup_field(field_name, result, model_admin)
            row[field_name] = display_for_field(value, f, empty_value_display)

        rows.append(row)
    return rows


def landing(request):
    return render(request, 'adminsheets/index.html')


def sheet(request, path):
    model_class, model_admin = admin_sheets.registry.get(path, (None, None))

    column_def = _get_column_def(model_class, model_admin)
    context = {}
    context['column_def'] = json.dumps(column_def)
    context['row_data'] = json.dumps(
        _get_results(
            model_class,
            model_admin,
            model_admin.get_queryset(request)
        )
    )

    return render(request, 'adminsheets/index.html', context)
