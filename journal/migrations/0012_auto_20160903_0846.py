# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-09-03 08:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0011_invoice_subtotal_due'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='modifier',
            field=models.ManyToManyField(blank=True, to='journal.InvoiceModifier'),
        ),
    ]
