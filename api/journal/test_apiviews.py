from datetime import datetime, timedelta, timezone
from django.urls import reverse
from django.conf import settings
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import force_authenticate, APIClient
from model_bakery import baker

from journal.invoices import save_invoice_tasks


class TaskListTest(TestCase):
    def test_filter_no_invoice(self):
        account = baker.make("journal.Account", make_m2m=True)
        project = baker.make("journal.Project", account=account)
        token = Token.objects.create(user=account.users.first())

        task_1 = baker.make("journal.Task", project=project)
        task_2 = baker.make("journal.Task", project=project, make_m2m=True)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.get(
            reverse("tasks-list"), {"project": project.id, "no_invoice": True}
        )

        data = response.json()
        self.assertEquals(response.status_code, 200)
        self.assertEquals(data["count"], 1)
        self.assertEquals(data["results"][0]["id"], task_1.id)


class TimeSlipListTest(TestCase):
    def test_filter_no_invoice(self):
        account = baker.make("journal.Account", make_m2m=True)
        project = baker.make("journal.Project", account=account)
        token = Token.objects.create(user=account.users.first())

        timeslip_1 = baker.make("journal.TimeSlip", project=project)
        timeslip_2 = baker.make(
            "journal.TimeSlip", project=project, _fill_optional=["invoice"]
        )

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.get(
            reverse("timeslips-list"), {"project": project.id, "no_invoice": True}
        )

        data = response.json()
        self.assertEquals(response.status_code, 200)
        self.assertEquals(data["count"], 1)
        self.assertEquals(data["results"][0]["id"], timeslip_1.id)


class TaskSummaryTest(TestCase):
    def test_get(self):
        account = baker.make("journal.Account", make_m2m=True)
        project = baker.make("journal.Project", account=account)
        token = Token.objects.create(user=account.users.first())

        task = baker.make("journal.Task", project=project)
        timeslip_1 = baker.make("journal.TimeSlip", project=project, task=task)
        timeslip_2 = baker.make("journal.TimeSlip", project=project, task=task)
        timeslip_3 = baker.make("journal.TimeSlip", project=project, task=task)
        invoice_1 = baker.make(
            "journal.Invoice", project=project, timeslips=[timeslip_1, timeslip_2]
        )
        save_invoice_tasks(invoice_1, [])

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.get(reverse("task-summary", kwargs={"pk": task.pk}))

        data = response.json()

        invoices = data["invoices"]
        self.assertEquals(len(invoices), 1)
        self.assertEquals(invoices[0]["sequence_num"], invoice_1.sequence_num)
        self.assertEquals(invoices[0]["project"], invoice_1.project.id)

        timeslips = data["timeslips"]
        self.assertEquals(len(timeslips), 3)
