# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2019-07-04 12:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0040_auto_20190704_0800'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invoiceitem',
            name='invoice',
        ),
        migrations.RemoveField(
            model_name='task',
            name='invoice',
        ),
        migrations.AlterField(
            model_name='task',
            name='invoices',
            field=models.ManyToManyField(related_name='tasks', through='journal.TaskInvoice', to='journal.Invoice'),
        ),
        migrations.DeleteModel(
            name='InvoiceItem',
        ),
    ]
