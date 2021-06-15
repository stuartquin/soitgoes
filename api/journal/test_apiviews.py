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
            reverse("projects_new_invoice", kwargs={"project": project.id}),
        )

        data = response.json()
        self.assertEquals(response.status_code, 200)
        self.assertEquals(data["tasks"], [task.pk])
        self.assertEquals(data["timeslips"], [timeslip_1.pk, timeslip_2.pk])
