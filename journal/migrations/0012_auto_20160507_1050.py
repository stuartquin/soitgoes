# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-05-07 10:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0011_auto_20160507_1038'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='hourly_rate',
            field=models.FloatField(default=0.0),
        ),
    ]
