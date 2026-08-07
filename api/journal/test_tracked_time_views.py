from datetime import datetime, timedelta, timezone

from django.urls import reverse
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from model_bakery import baker

from journal.models import TrackedTime


def _iso(dt):
    return dt.isoformat()


class TrackedTimeListTest(TestCase):
    def setUp(self):
        self.account = baker.make("journal.Account", make_m2m=True)
        self.user = self.account.users.first()
        self.project = baker.make("journal.Project", account=self.account)
        self.token = Token.objects.create(user=self.user)

        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.now = datetime(2024, 1, 1, 10, 0, 0, tzinfo=timezone.utc)

    def test_list(self):
        first = baker.make(
            "journal.TrackedTime",
            project=self.project,
            user=self.user,
            started_at=self.now,
            ended_at=self.now + timedelta(hours=1),
        )
        second = baker.make(
            "journal.TrackedTime",
            project=self.project,
            user=self.user,
            started_at=self.now + timedelta(hours=2),
        )

        response = self.client.get(
            reverse("tracked-times-list"), {"project": self.project.id}
        )

        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["count"], 2)
        # ordered by -started_at
        self.assertEqual(data["results"][0]["id"], second.id)
        self.assertEqual(data["results"][1]["id"], first.id)

    def test_create(self):
        started_at = self.now
        response = self.client.post(
            reverse("tracked-times-list"),
            {
                "project": self.project.id,
                "started_at": _iso(started_at),
                "comment": "working on a thing",
            },
        )

        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data["project"], self.project.id)
        self.assertEqual(data["comment"], "working on a thing")
        self.assertEqual(data["started_at"], started_at.isoformat().replace("+00:00", "Z"))
        self.assertIsNone(data["ended_at"])
        self.assertIsNone(data["duration"])
        # user defaulted from the authenticated request (HiddenField is
        # not rendered, so check the persisted row)
        self.assertTrue(TrackedTime.objects.filter(id=data["id"], user=self.user).exists())

    def test_create_with_duration(self):
        started_at = self.now
        ended_at = self.now + timedelta(seconds=90)
        response = self.client.post(
            reverse("tracked-times-list"),
            {
                "project": self.project.id,
                "started_at": _iso(started_at),
                "ended_at": _iso(ended_at),
            },
        )

        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data["duration"], 90)

    def test_filter_open(self):
        open_tt = baker.make(
            "journal.TrackedTime",
            project=self.project,
            user=self.user,
            started_at=self.now,
            ended_at=None,
        )
        closed_tt = baker.make(
            "journal.TrackedTime",
            project=self.project,
            user=self.user,
            started_at=self.now + timedelta(hours=1),
            ended_at=self.now + timedelta(hours=2),
        )

        response = self.client.get(
            reverse("tracked-times-list"),
            {"project": self.project.id, "open": True},
        )

        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["results"][0]["id"], open_tt.id)


class TrackedTimeDetailTest(TestCase):
    def setUp(self):
        self.account = baker.make("journal.Account", make_m2m=True)
        self.user = self.account.users.first()
        self.project = baker.make("journal.Project", account=self.account)
        self.token = Token.objects.create(user=self.user)

        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.started_at = datetime(2024, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
        self.tracked = baker.make(
            "journal.TrackedTime",
            project=self.project,
            user=self.user,
            started_at=self.started_at,
            ended_at=None,
            comment="initial comment",
        )

    def test_retrieve(self):
        response = self.client.get(
            reverse("tracked-times-detail", kwargs={"pk": self.tracked.pk})
        )

        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["id"], self.tracked.id)
        self.assertEqual(data["project"], self.project.id)
        self.assertEqual(data["comment"], "initial comment")
        self.assertIsNone(data["duration"])

    def test_update(self):
        ended_at = self.started_at + timedelta(minutes=30)
        response = self.client.patch(
            reverse("tracked-times-detail", kwargs={"pk": self.tracked.pk}),
            {
                "ended_at": _iso(ended_at),
                "comment": "wrapped up",
            },
        )

        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["comment"], "wrapped up")
        self.assertEqual(data["duration"], 30 * 60)
        self.tracked.refresh_from_db()
        self.assertIsNotNone(self.tracked.ended_at)

    def test_destroy(self):
        pk = self.tracked.pk
        response = self.client.delete(
            reverse("tracked-times-detail", kwargs={"pk": pk})
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(TrackedTime.objects.filter(pk=pk).exists())
