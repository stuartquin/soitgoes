from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

import datetime

import journal.models as models


class CurrentAccountDefault(serializers.CurrentUserDefault):
    def __call__(self, *args, **kwargs):
        __import__("ipdb").set_trace()
        return self.user.account_set.first()


class LogActivity(serializers.ModelSerializer):
    def create(self, validated_data):
        instance = super().create(validated_data)
        user = self.context["request"].user
        models.Activity.create(user, instance.pk, self.ACTIVITY_CODE)
        return instance

    def update(self, instance, validated_data, status=None):
        user = self.context["request"].user
        models.Activity.update(user, instance.pk, self.ACTIVITY_CODE, status)
        return super().update(instance, validated_data)


class ProjectSerializer(LogActivity):
    ACTIVITY_CODE = "PRO"
    uninvoiced_hours = serializers.IntegerField(
        source="get_uninvoiced_hours", read_only=True
    )
    total_paid = serializers.IntegerField(source="get_total_paid", read_only=True)
    account = serializers.HiddenField(default=CurrentAccountDefault())
    next_sequence_num = serializers.SerializerMethodField(read_only=True)

    def get_next_sequence_num(self, project):
        return models.Invoice.get_next_sequence_num(project.id)

    class Meta:
        model = models.Project
        fields = [
            "id",
            "name",
            "contact",
            "created_at",
            "uninvoiced_hours",
            "total_paid",
            "hourly_rate",
            "weekly_rate",
            "archived",
            "currency",
            "account",
            "default_task",
            "next_sequence_num",
            "billing_unit",
        ]


class TimeSlipSerializer(LogActivity):
    ACTIVITY_CODE = "TIM"
    cost = serializers.FloatField(read_only=True)

    class Meta:
        model = models.TimeSlip
        partial = True
        fields = [
            "id",
            "user",
            "hours",
            "hourly_rate",
            "project",
            "task",
            "invoice",
            "cost",
            "date",
        ]


class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["key"]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Company
        fields = ("id", "name", "billing", "logo_image", "contacts")


class ContactSerializer(serializers.ModelSerializer):
    account = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Contact
        fields = (
            "id",
            "name",
            "email",
            "created_at",
            "account",
            "address1",
            "address2",
            "city",
            "post_code",
            "company",
        )


class AccountSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = models.Account
        fields = ("id", "company")
        depth = 1


class InvoiceModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.InvoiceModifier
        fields = ["id", "name", "percent", "created_at"]


class TaskNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TaskNote
        fields = ["content", "content_type"]


class TaskSerializer(serializers.ModelSerializer):
    notes = TaskNoteSerializer(many=True, read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def update(self, instance, validated_data):
        state = validated_data.get("state")
        if state == models.TASK_STATUS_DONE:
            validated_data["completed_at"] = datetime.datetime.now()

        return super().update(instance, validated_data)

    class Meta:
        model = models.Task
        partial = True
        fields = [
            "id",
            "user",
            "project",
            "name",
            "cost",
            "created_at",
            "activity_at",
            "completed_at",
            "due_date",
            "hours_spent",
            "hours_predicted",
            "billing_type",
            "state",
            "invoices",
            "notes",
        ]


class InvoiceSerializer(serializers.ModelSerializer):
    ACTIVITY_CODE = "INV"
    timeslips = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.TimeSlip.objects.all()
    )
    tasks = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Task.objects.all()
    )

    def update(self, instance, validated_data):
        request_data = self.context["request"].data
        if "status" in request_data:
            if request_data["status"] == "PAID":
                instance.paid_at = datetime.datetime.now()
                instance.total_paid = request_data["total_paid"]
            if request_data["status"] == "ISSUED":
                instance.issued_at = datetime.datetime.now()

        return super().update(instance, validated_data)

    class Meta:
        model = models.Invoice
        partial = True
        fields = [
            "id",
            "sequence_num",
            "project",
            "created_at",
            "issued_at",
            "paid_at",
            "due_date",
            "total_paid",
            "total_due",
            "subtotal_due",
            "status",
            "reference",
            "group_by",
            "show_hours",
            "timeslips",
            "tasks",
            "modifier",
            "pdf_name",
            "name",
            "exchange_rate",
            "currency",
            "billing_unit",
        ]


class TaskInvoiceSerializer(serializers.ModelSerializer):
    timeslips = serializers.SerializerMethodField()

    def get_timeslips(self, obj):
        return [t[0] for t in obj.task.timeslip_set.values_list("pk")]

    class Meta:
        model = models.TaskInvoice
        fields = ["id", "created_at", "invoice", "cost", "task", "hours_spent"]


class ProjectSummarySerializer(serializers.Serializer):
    project = serializers.PrimaryKeyRelatedField(queryset=models.Project.objects.all())
    hours = serializers.FloatField(read_only=True)
    total = serializers.FloatField(read_only=True)
    next_sequence_num = serializers.IntegerField(read_only=True)
    previous_invoice = InvoiceSerializer(read_only=True)


class TaskSummarySerializer(serializers.Serializer):
    invoices = InvoiceSerializer(many=True)
    timeslips = TimeSlipSerializer(source="timeslip_set", many=True)


class VersionSerializer(serializers.Serializer):
    git_branch = serializers.CharField(read_only=True)
    git_rev = serializers.CharField(read_only=True)


class ExchangeRateSerializer(serializers.Serializer):
    rates = serializers.DictField(read_only=True)
