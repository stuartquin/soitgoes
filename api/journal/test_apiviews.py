from datetime import datetime, timedelta, timezone
from django.urls import reverse
from django.conf import settings
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import force_authenticate, APIClient
from model_bakery import baker


class NewInvoiceDetailTest(TestCase):
    def test_retrieve_new_invoice(self):
        account = baker.make("journal.Account", make_m2m=True)
        project = baker.make("journal.Project", account=account)
        token = Token.objects.create(user=account.users.first())

        task = baker.make("journal.Task", project=project)
        timeslip_1 = baker.make("journal.TimeSlip", task=task, project=project, hours=5)
        timeslip_2 = baker.make("journal.TimeSlip", task=task, project=project, hours=4)
        timeslip_3 = baker.make(
            "journal.TimeSlip",
            task=task,
            project=project,
            hours=5,
            _fill_optional=["invoice"],
        )

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.get(
            reverse("projects-new-invoice", kwargs={"project": project.id}),
        )

        data = response.json()
        self.assertEquals(response.status_code, 200)
        self.assertEquals(data["tasks"], [task.pk])
        self.assertEquals(data["timeslips"], [timeslip_1.pk, timeslip_2.pk])


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
