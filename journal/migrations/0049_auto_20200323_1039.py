# Generated by Django 3.0.4 on 2020-03-23 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal', '0048_auto_20200213_2112'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskinvoice',
            name='cost',
            field=models.DecimalField(decimal_places=2, max_digits=12),
        ),
        migrations.AlterField(
            model_name='timeslip',
            name='hours',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=6),
        ),
    ]
