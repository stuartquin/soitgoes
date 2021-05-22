# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2019-10-12 13:25
from __future__ import unicode_literals

from django.db import migrations

def set_hourly_rates(apps, schema_editor):
    Project = apps.get_model('journal', 'Project')
    projects = Project.objects.all()

    for project in projects:
        project.timeslip_set.update(hourly_rate=project.hourly_rate)


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0044_auto_20191012_1122'),
    ]

    operations = [
        migrations.RunPython(set_hourly_rates),
    ]