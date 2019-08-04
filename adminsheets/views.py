import json
from django.shortcuts import render
from django.contrib.admin.utils import (
    display_for_field, display_for_value, label_for_field, lookup_field,
)

from adminsheets.sites import admin_sheets


def _update(request, model_admin):
    data = json.loads(request.read())

    for item in data.values():
        obj = model_admin.get_object(request, item['id'])
        del item['id']
        ModelForm = model_admin.get_form(request, obj, fields=item.keys())
        form = ModelForm(item, request.FILES, instance=obj)

        if form.is_valid():
            form.save()


def _get_list_display(model_admin):
    return ['id'] + list(model_admin.list_display)


def _get_column_def(model_class, model_admin):
    column_def = []

    for i, field_name in enumerate(_get_list_display(model_admin)):
        text, attr = label_for_field(
            field_name, model_class,
            model_admin=model_admin,
            return_attr=True
        )
        column_def.append({
            'headerName': text,
            'field': field_name,
            'editable': field_name != 'id',
            'sortable': True,
            'filter': True,
        })

    return column_def


def _get_display_value(value, f, empty_value_display):
    if f.get_internal_type() == 'BooleanField':
        return str(value)

    return  display_for_field(value, f, empty_value_display)


def _get_results(model_class, model_admin, queryset):
    rows = []
    empty_value_display = model_admin.get_empty_value_display()
    for result in queryset:
        row = {}
        for field_name in _get_list_display(model_admin):
            f, attr, value = lookup_field(field_name, result, model_admin)
            row[field_name] = _get_display_value(value, f, empty_value_display)

        rows.append(row)
    return rows


def landing(request):
    return render(request, 'adminsheets/index.html')


def sheet(request, path):
    model_class, model_admin = admin_sheets.registry.get(path, (None, None))

    if request.method == 'PUT':
        _update(request, model_admin)

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
