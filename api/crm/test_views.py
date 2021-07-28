from datetime import datetime, timedelta, timezone
from django.urls import reverse
from django.conf import settings
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import force_authenticate, APIClient
from model_bakery import baker


class NoteListCreateViewTest(TestCase):
    def test_create(self):
        account = baker.make("journal.Account", make_m2m=True)
        contact = baker.make("journal.Contact", account=account, make_m2m=True)
        token = Token.objects.create(user=account.users.first())

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.post(
            reverse("notes-list"), {"content": "test note", "contact": contact.id}
        )

        data = response.json()
        self.assertEquals(response.status_code, 201)
        self.assertEquals(data["content"], "test note")
        self.assertEquals(data["contact"], contact.id)

    def test_list(self):
        account = baker.make("journal.Account", make_m2m=True)
        contact_1 = baker.make("journal.Contact", account=account, make_m2m=True)
        contact_2 = baker.make("journal.Contact", account=account, make_m2m=True)

        baker.make("crm.Note", contact=contact_1)
        baker.make("crm.Note", contact=contact_1)
        baker.make("crm.Note", contact=contact_2)
        token = Token.objects.create(user=account.users.first())

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.get(reverse("notes-list"), {"contact": contact_1.id})

        data = response.json()
        self.assertEquals(response.status_code, 200)
        self.assertEquals(data["count"], 2)
