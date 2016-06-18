from django.db.models import Max
from rest_framework import serializers

from .models import Project, TimeSlip, Invoice, InvoiceItem
from libs import invoicepdf, vat


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'contact', 'created_at']
        depth = 1


class TimeSlipReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlip
        depth = 1


class TimeSlipWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlip


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ('id', 'name', )


class InvoiceSerializer(serializers.ModelSerializer):

    def save(self,):
        project = self.validated_data['project']
        invoices = Invoice.objects.filter(project=project)
        max = invoices.aggregate(Max('sequence_num')).get('sequence_num__max')
        return super().save(sequence_num=(max or 0) + 1)

    class Meta:
        model = Invoice
        depth = 2
