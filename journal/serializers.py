from django.db.models import Max
from .models import Project, TimeSlip, Invoice
from rest_framework import serializers

from libs import pdf


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'contact', 'created_at']


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

    def save(self):
        data = self.validated_data
        invoices = Invoice.objects.filter(project=data['project'])
        max = invoices.aggregate(Max('sequence_num')).get('sequence_num__max')
        sequence_num = (max or 0) + 1

        invoice = Invoice(sequence_num=sequence_num, project=data['project'])
        invoice.save()

        timeslips = TimeSlip.objects.filter(id__in=data['timeslips'])
        timeslips.update(invoice=invoice.id)

        pdf.generate_invoice(invoice)

    class Meta:
        model = Invoice
