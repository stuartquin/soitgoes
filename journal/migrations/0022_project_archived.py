# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-11-20 09:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0021_auto_20161030_1320'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='archived',
            field=models.BooleanField(default=False),
        ),
    ]
