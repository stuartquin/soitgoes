# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-07-31 15:58
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0002_billing'),
    ]

    operations = [
        migrations.AddField(
            model_name='billing',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 7, 31, 15, 58, 37, 95237, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='company',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 7, 31, 15, 58, 43, 100620, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
    ]
