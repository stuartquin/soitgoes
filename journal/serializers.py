from rest_framework import serializers
from django.contrib.auth.models import User

import datetime

import journal.models as models


class LogActivity(serializers.ModelSerializer):
    def create(self, validated_data):
        instance = super().create(validated_data)
        user = self.context['request'].user
        models.Activity.create(user, instance.pk, self.ACTIVITY_CODE)
        return instance

    def update(self, instance, validated_data, status=None):
        user = self.context['request'].user
        models.Activity.update(user, instance.pk, self.ACTIVITY_CODE, status)
        return super().update(instance, validated_data)


class ProjectSerializer(LogActivity):
    ACTIVITY_CODE = 'PRO'
    uninvoiced_hours = serializers.IntegerField(source='get_uninvoiced_hours')
    total_paid = serializers.IntegerField(source='get_total_paid')

    class Meta:
        model = models.Project
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


class TimeSlipSerializer(LogActivity):
    ACTIVITY_CODE = 'TIM'

    class Meta:
        model = models.TimeSlip


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'last_login',
            'email'
        ]


class InvoiceItemSerializer(serializers.ModelSerializer):
    def save(self, *args, **kwargs):
        invoice = models.Invoice.objects.filter(
            id=self.context['request'].data['invoice']
        ).first()
        return super().save(invoice=invoice)

    class Meta:
        model = models.InvoiceItem


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Company
        fields = ('id', 'name', 'billing')


class AccountSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = models.Account
        fields = ('id', 'company', 'users')
        depth = 1


class InvoiceSerializer(LogActivity):
    ACTIVITY_CODE = 'INV'

    def update(self, instance, validated_data):
        request_data = self.context['request'].data
        if 'paid' in request_data and request_data['paid']:
            instance.paid_at = datetime.datetime.now()
            instance.total_paid = request_data['total_paid']
            status = 'PAID'
        else:
            status = 'ISSUED'
            instance.issued_at = datetime.datetime.now()

        if 'modifiers' in request_data and request_data['modifiers']:
            instance.modifier.add(None)

        return super().update(instance, validated_data, status)

    def save(self, *args, **kwargs):
        project = models.Project.objects.filter(
            id=self.context['request'].data['project']
        ).first()
        return super().save(project=project)

    class Meta:
        model = models.Invoice
        depth = 1
