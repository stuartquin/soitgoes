# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2019-06-02 10:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0032_auto_20181025_0813'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='state',
            field=models.CharField(choices=[('OPEN', 'Open'), ('PROGRESS', 'In Progress'), ('DONE', 'Complete'), ('REJECTED', 'Rejected')], default='OPEN', max_length=256),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='issued_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]