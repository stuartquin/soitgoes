# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-06-01 21:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0023_timeslip_user'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='timeslip',
            unique_together=set([('user', 'project', 'date')]),
        ),
    ]