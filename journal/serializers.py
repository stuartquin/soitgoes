from rest_framework import serializers

from .models import Project, TimeSlip, Invoice, InvoiceItem


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
            'hourly_rate'
        ]
        depth = 1


class TimeSlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlip


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ('id', 'name', )


class InvoiceSerializer(serializers.ModelSerializer):
    def save(self, *args, **kwargs):
        project = Project.objects.filter(
            id=self.context['request'].data['project']
        ).first()
        return super().save(project=project)

    class Meta:
        model = Invoice
