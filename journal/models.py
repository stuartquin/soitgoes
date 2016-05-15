from django.contrib.auth.models import User
from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=512)
    address1 = models.CharField(max_length=512, blank=True, null=True)
    address2 = models.CharField(max_length=512, blank=True, null=True)
    city = models.CharField(max_length=128, blank=True, null=True)
    post_code = models.CharField(max_length=128, blank=True, null=True)
    reg_number = models.CharField(max_length=128, blank=True, null=True)
    logo_image = models.TextField(blank=True, null=True)

    def __str__(self):
        return "%s, %s" % (self.name, self.city)


class Account(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(User)
    company = models.ForeignKey(
        Company, models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return "%s" % (self.company.name)


class Contact(models.Model):
    name = models.CharField(max_length=512)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    account = models.ForeignKey(Account)
    company = models.ForeignKey(Company, default=None)

    def __str__(self):
        return "%s (%s)" % (self.name, self.email)


class Project(models.Model):
    contact = models.ForeignKey(Contact)
    account = models.ForeignKey(Account)
    name = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)
    hourly_rate = models.FloatField(default=0.0)
    hours_per_day = models.IntegerField(default=0)

    def __str__(self):
        return "%s" % (self.name)


class Invoice(models.Model):
    sequence_num = models.IntegerField(default=0)
    project = models.ForeignKey(Project)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "[%s] %s" % (self.sequence_num, self.project.name)


class TimeSlip(models.Model):
    project = models.ForeignKey(Project)
    created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    hours = models.FloatField(default=0.0)

    comment = models.CharField(max_length=512, blank=True, null=True)
    invoice = models.ForeignKey(
        Invoice, models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return "[%s] %s" % (self.project.name, self.comment)
