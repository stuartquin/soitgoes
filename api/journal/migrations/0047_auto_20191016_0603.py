# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2019-10-16 06:03
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0046_taskinvoice_hours_spent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='expense',
            name='project',
        ),
        migrations.RemoveField(
            model_name='expense',
            name='user',
        ),
        migrations.DeleteModel(
            name='Expense',
        ),
    ]