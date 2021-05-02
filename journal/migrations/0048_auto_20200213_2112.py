# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2020-02-13 21:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0047_auto_20191016_0603'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='daily_rate',
            field=models.DecimalField(blank=True, decimal_places=3, max_digits=6, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='state',
            field=models.CharField(choices=[('OPEN', 'Open'), ('PROGRESS', 'In Progress'), ('DONE', 'Complete')], default='OPEN', max_length=256),
        ),
        migrations.AlterField(
            model_name='timeslip',
            name='hourly_rate',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=6),
        ),
    ]