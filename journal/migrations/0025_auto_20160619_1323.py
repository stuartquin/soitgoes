# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-06-19 13:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0024_auto_20160601_2115'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invoice',
            name='sequence_num',
        ),
        migrations.AddField(
            model_name='invoice',
            name='issued_at',
            field=models.DateTimeField(blank=True, null=True, default=None),
        ),
        migrations.AlterField(
            model_name='invoiceitem',
            name='invoice',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to='journal.Invoice'),
        ),
        migrations.AlterField(
            model_name='timeslip',
            name='invoice',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='timeslips', to='journal.Invoice'),
        ),
    ]
