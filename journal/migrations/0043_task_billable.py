# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2019-09-20 08:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0042_auto_20190710_1110'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='billable',
            field=models.BooleanField(default=True),
        ),
    ]
