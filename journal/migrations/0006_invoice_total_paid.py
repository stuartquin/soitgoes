# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-08-24 15:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0005_invoice_paid_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='total_paid',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
    ]
