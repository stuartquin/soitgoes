# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-10-30 13:18
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0019_expense_project'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='due_date',
            field=models.DateField(default=datetime.datetime(2016, 10, 30, 13, 18, 33, 499527, tzinfo=utc)),
            preserve_default=False,
        ),
    ]