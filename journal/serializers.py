from rest_framework import serializers
import datetime

from .models import Project, TimeSlip, Invoice, InvoiceItem, Account, Company


class ProjectSerializer(serializers.ModelSerializer):
    uninvoiced_hours = serializers.IntegerField(source='get_uninvoiced_hours')
    total_paid = serializers.IntegerField(source='get_total_paid')

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'contact',
            'created_at',
            'uninvoiced_hours',
            'total_paid',
            'hourly_rate'
        ]
        depth = 1


class TimeSlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlip


class InvoiceItemSerializer(serializers.ModelSerializer):
    def save(self, *args, **kwargs):
        invoice = Invoice.objects.filter(
            id=self.context['request'].data['invoice']
        ).first()
        return super().save(invoice=invoice)

    class Meta:
        model = InvoiceItem


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        depth = 1
        fields = ('id', 'name', 'billing')


class AccountSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Account
        fields = ('id', 'company', )
        depth = 1


class InvoiceSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        request_data = self.context['request'].data
        if 'paid' in request_data and request_data['paid']:
            instance.paid_at = datetime.datetime.now()
            instance.total_paid = request_data['total_paid']
        else:
            instance.issued_at = datetime.datetime.now()

        if 'modifiers' in request_data and request_data['modifiers']:
            import ipdb; ipdb.set_trace()
            instance.modifier.add(None)

        return super().update(instance, validated_data)

    def save(self, *args, **kwargs):
        project = Project.objects.filter(
            id=self.context['request'].data['project']
        ).first()
        return super().save(project=project)

    class Meta:
        model = Invoice
        depth = 1
