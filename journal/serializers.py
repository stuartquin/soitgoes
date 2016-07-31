from rest_framework import serializers
import datetime

from .models import Project, TimeSlip, Invoice, InvoiceItem, Account, Company


class ProjectSerializer(serializers.ModelSerializer):
    uninvoiced_hours = serializers.IntegerField(source='get_uninvoiced_hours')

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'contact',
            'created_at',
            'uninvoiced_hours',
            'hourly_rate',
            'invoice_modifier'
        ]
        depth = 1


class TimeSlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlip


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ('id', 'name', )


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
        instance.issued_at = datetime.datetime.now()
        return super().update(instance, validated_data)

    def save(self, *args, **kwargs):
        project = Project.objects.filter(
            id=self.context['request'].data['project']
        ).first()
        return super().save(project=project)

    class Meta:
        model = Invoice
