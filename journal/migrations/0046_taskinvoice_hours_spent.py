# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2019-10-13 14:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0045_auto_20191012_1325'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskinvoice',
            name='hours_spent',
            field=models.FloatField(default=0.0),
        ),
    ]
