# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-13 14:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0003_auto_20160113_1109'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='thought',
            name='tags',
        ),
        migrations.AddField(
            model_name='thought',
            name='tags',
            field=models.TextField(null=True),
        ),
    ]
