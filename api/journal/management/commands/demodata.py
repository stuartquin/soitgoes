from django.core.management import BaseCommand

from datetime import timedelta, datetime
import random
import csv
from datetime import datetime

from journal.models import Invoice, Project, TimeSlip, Task, Contact, Account
from journal import invoices
from faker import Faker

fake = Faker()


TASK_NAMES = [
    "Web Development",
    "Server setup",
    "App design specification",
    "Database migrations",
    "CI/CD deployment setup",
    "API Refactoring",
    "3rd party integrations",
    "Process refinement and documentation",
    "Mentoring and upskilling",
    "Interviewing candidates",
    "Design system implementation",
    "Upgrade package.json versions",
]


def remove_all():
    Contact.objects.all().delete()


def create_invoices(project):
    now = datetime.now()

    for i in range(0, random.choice([1, 6])):
        fixed_tasks = create_tasks(project, random.choice([1, 3]), "FIXED")
        time_tasks = create_tasks(project, random.choice([1, 3]), "TIME")
        status = random.choice(["ISSUED", "PAID"])
        issued_at = now + timedelta(days=random.randint(-90, 0))
        due_date = issued_at + timedelta(days=random.choice([14, 30]))
        if status == "PAID":
            paid_at = due_date + timedelta(days=random.randint(-10, 10))
        else:
            paid_at = None

        group_by = random.choice(["tasks", "timeslips"])

        invoice = Invoice.objects.create(
            project=project,
            sequence_num=Invoice.get_next_sequence_num(project.id),
            status=status,
            due_date=due_date,
            issued_at=issued_at,
            paid_at=paid_at,
            group_by=group_by,
        )

        for task in time_tasks:
            invoice.timeslips.add(*task.timeslip_set.all())

        invoices.save_invoice_tasks(invoice, fixed_tasks)
        invoices.set_invoice_totals(invoice)


def create_timeslips(task):
    now = datetime.now()
    dates = list(
        set([now + timedelta(days=random.randint(-30, 20)) for i in range(0, 100)])
    )

    for i in range(0, random.randint(2, 10)):
        TimeSlip.objects.create(
            project=task.project,
            user=task.project.account.users.first(),
            date=dates.pop(),
            hourly_rate=task.project.hourly_rate,
            hours=random.choice([4, 8]),
            task=task,
        )


def create_tasks(project, total, billing_type=None):
    tasks = []
    for i in range(0, total):
        billing_type = billing_type or random.choice(["TIME", "FIXED"])
        cost = random.choice([1200, 2765, 500, 432]) if billing_type == "FIXED" else 0
        task = Task.objects.create(
            project=project,
            user=project.account.users.first(),
            billing_type=billing_type,
            name=fake.catch_phrase(),
            cost=cost,
            state=random.choice(["OPEN", "DONE"]),
        )
        if billing_type == "TIME":
            create_timeslips(task)
        tasks.append(task)

    return tasks


def create_contacts(account, num=3):
    for i in range(0, num):
        contact = Contact.objects.create(
            name=fake.name(), email=fake.email(), account=Account.objects.first()
        )

        project = Project.objects.create(
            contact=contact,
            account=account,
            name=fake.company(),
            hourly_rate=random.choice([75, 100, 105]),
            hours_per_day=random.choice([4, 8]),
        )
        create_invoices(project)
        create_tasks(project, random.choice([1, 3]))


class Command(BaseCommand):
    # Show this when the user types help
    help = "Replace existing DB data with mock data"

    def handle(self, *args, **options):
        account = Account.objects.first()
        remove_all()
        create_contacts(account)
