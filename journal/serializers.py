from django.db.models import Max
from rest_framework import serializers

from .models import Project, TimeSlip, Invoice
from libs import invoicepdf, vat


def user_account(func):
    def wrapper(self, *args, **kwargs):
        kwargs['account'] = self.context['request'].user.account_set.first()
        func(self, *args, **kwargs)
    return wrapper


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'contact', 'created_at']


class TimeSlipSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(many=True, *args, **kwargs)

    class Meta:
        model = TimeSlip


class InvoiceSerializer(serializers.ModelSerializer):
    timeslips = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    sequence_num = serializers.IntegerField(read_only=True)

    @user_account
    def save(self, account):
        data = self.validated_data
        project = data['project']
        invoices = Invoice.objects.filter(project=project)
        max = invoices.aggregate(Max('sequence_num')).get('sequence_num__max')
        sequence_num = (max or 0) + 1

        invoice = Invoice(sequence_num=sequence_num, project=data['project'])
        invoice.save()

        timeslips = TimeSlip.objects.filter(id__in=data['timeslips'])
        timeslips.update(invoice=invoice.id)
        timeslip_total = sum([t.hours for t in timeslips]) * project.hourly_rate

        # Adds additional invoice items, maybe should be elsewhere
        items = []
        if project.account.company.vat_number:
            items.append(vat.create_vat_item(timeslip_total, invoice))

        invoicepdf.render(invoice, account, project, items)

    class Meta:
        model = Invoice
