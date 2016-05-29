# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-05-11 20:19
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('journal', '0014_auto_20160507_1052'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=512)),
                ('address1', models.CharField(blank=True, max_length=512, null=True)),
                ('address2', models.CharField(blank=True, max_length=512, null=True)),
                ('city', models.CharField(blank=True, max_length=128, null=True)),
                ('post_code', models.CharField(blank=True, max_length=128, null=True)),
                ('reg_number', models.CharField(blank=True, max_length=128, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserAccount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='journal.Account')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='timeslip',
            name='comment',
            field=models.CharField(blank=True, max_length=512, null=True),
        ),
        migrations.AddField(
            model_name='account',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='journal.Company'),
        ),
        migrations.AddField(
            model_name='contact',
            name='account',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='journal.Account'),
        ),
    ]