from django.core.management import BaseCommand

from datetime import timedelta, datetime
import random
import csv
from datetime import datetime

from journal.models import Invoice, Project, TimeSlip, Task, Contact, Account
from faker import Faker

fake = Faker()


TASK_NAMES = [
    'Web Development',
    'Server setup',
    'App design specification',
    'Database migrations',
    'CI/CD deployment setup',
    'API Refactoring',
    '3rd party integrations',
    'Process refinement and documentation',
    'Mentoring and upskilling',
    'Interviewing candidates',
    'Design system implementation',
    'Upgrade package.json versions',
]


def remove_all():
    Contact.objects.all().delete()

def create_timeslips(task):
    now = datetime.now()
    dates = list(set([now - timedelta(days=random.randint(0, 60)) for i in range(0, 100)]))

    for i in range(0, random.randint(2, 14)):
        TimeSlip.objects.create(
            project=task.project,
            user=task.project.account.users.first(),
            date=dates.pop(),
            hourly_rate=task.project.hourly_rate,
            hours=random.choice([4, 8]),
            task=task
        )


def create_tasks(project):
    for i in range(0, random.choice([1, 3])):
        billing_type = random.choice(['TIME', 'FIXED'])
        cost = random.choice([1200, 2765, 500, 432]) if billing_type == 'FIXED' else 0
        task = Task.objects.create(
            project=project,
            user=project.account.users.first(),
            billing_type=billing_type,
            name=random.choice(TASK_NAMES),
            cost=cost
        )
        create_timeslips(task)


def create_contacts(account, num=3):
    for i in range(0, num):
        contact = Contact.objects.create(
            name=fake.name(),
            email=fake.email(),
            account=Account.objects.first()
        )

        project = Project.objects.create(
            contact=contact,
            account=account,
            name=fake.company(),
            hourly_rate=random.choice([75, 100, 105]),
            hours_per_day=random.choice([4, 8]),
        )
        create_tasks(project)


class Command(BaseCommand):
    # Show this when the user types help
    help = 'Replace existing DB data with mock data'


    def handle(self, *args, **options):
        account = Account.objects.first()
        remove_all()
        create_contacts(account)
