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
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["results"][0]["id"], task_1.id)


class TimeSlipListTest(TestCase):
    def test_filter_no_invoice(self):
        account = baker.make("journal.Account", make_m2m=True)
        project = baker.make("journal.Project", account=account)
        token = Token.objects.create(user=account.users.first())

        timeslip_1 = baker.make(
            "journal.TimeSlip",
            project=project,
            hours=2,
        )
        timeslip_2 = baker.make(
            "journal.TimeSlip", project=project, _fill_optional=["invoice"]
        )

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.get(
            reverse("timeslips-list"), {"project": project.id, "no_invoice": True}
        )

        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["results"][0]["id"], timeslip_1.id)


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
        self.assertEqual(len(invoices), 1)
        self.assertEqual(invoices[0]["sequence_num"], invoice_1.sequence_num)
        self.assertEqual(invoices[0]["project"], invoice_1.project.id)

        timeslips = data["timeslips"]
        self.assertEqual(len(timeslips), 3)


class ContactListTest(TestCase):
    def test_create(self):
        account = baker.make("journal.Account", make_m2m=True)
        token = Token.objects.create(user=account.users.first())

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.post(
            reverse("contacts-list"), {"name": "test name", "email": "test@email.com"}
        )

        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data["account"], account.pk)
        self.assertEqual(data["name"], "test name")
        self.assertEqual(data["email"], "test@email.com")

    def test_update(self):
        account = baker.make("journal.Account", make_m2m=True)
        contact = baker.make("journal.Contact", account=account, make_m2m=True)
        token = Token.objects.create(user=account.users.first())

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.put(
            reverse("contacts-detail", kwargs={"pk": contact.pk}),
            {"name": "updated name", "email": "updated@email.com"},
        )

        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["account"], account.pk)
        self.assertEqual(data["name"], "updated name")
        self.assertEqual(data["email"], "updated@email.com")

    def test_update_permission_failure(self):
        account = baker.make("journal.Account", make_m2m=True)
        contact_account = baker.make("journal.Account", make_m2m=True)
        contact = baker.make("journal.Contact", account=contact_account, make_m2m=True)
        token = Token.objects.create(user=account.users.first())

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.put(
            reverse("contacts-detail", kwargs={"pk": contact.pk}),
            {"name": "updated name", "email": "updated@email.com"},
        )

        data = response.json()
        self.assertEqual(response.status_code, 403)
