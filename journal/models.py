from django.contrib.auth.models import User
from django.db import models


class Contact(models.Model):
    name = models.CharField(max_length=512)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s (%s)" % (self.name, self.email)


class Project(models.Model):
    contact = models.ForeignKey(Contact)
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

    comment = models.CharField(models.SET_NULL, max_length=512, blank=True, null=True)
    invoice = models.ForeignKey(Invoice, models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return "[%s] %s" % (self.project.name, self.comment)
