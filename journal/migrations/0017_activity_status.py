# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-09-25 15:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0016_remove_timeslip_created_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='status',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]