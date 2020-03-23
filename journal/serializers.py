from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

import datetime

import journal.models as models


class CurrentAccountDefault(serializers.CurrentUserDefault):
    def __call__(self):
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
            "archived",
            "currency",
            "account",
            "default_task",
        ]


class TimeSlipSerializer(LogActivity):
    ACTIVITY_CODE = "TIM"

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "last_login"]


class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["key"]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Company
        fields = ("id", "name", "billing", "logo_image")


class ContactSerializer(serializers.ModelSerializer):
    account = serializers.HiddenField(default=CurrentAccountDefault())

    class Meta:
        model = models.Contact
        fields = (
            "id",
            "name",
            "email",
            "created_at",
            "account",
            "address1",
            "post_code",
        )


class AccountSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = models.Account
        fields = ("id", "company", "users")
        depth = 1


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Activity


class InvoiceModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.InvoiceModifier
        fields = ["id", "name", "percent", "created_at"]


class TaskNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TaskNote
        fields = ["__all__"]


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
    # TODO restrict this to matching project
    timeslips = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.TimeSlip.objects.all()
    )
    tasks = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Task.objects.all()
    )
    modifier = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.InvoiceModifier.objects.all()
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
        ]


class TaskInvoiceSerializer(serializers.ModelSerializer):
    timeslips = serializers.SerializerMethodField()

    def get_timeslips(self, obj):
        return [t[0] for t in obj.task.timeslip_set.values_list("pk")]

    class Meta:
        model = models.TaskInvoice
        fields = ["id", "created_at", "invoice", "cost", "task", "hours_spent"]


class InvoiceDetailSerializer(InvoiceSerializer):
    class Meta:
        model = models.Invoice
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
        ]
