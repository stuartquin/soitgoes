from .models import Project, TimeSlip
from rest_framework import serializers


# class ThoughtSerializer(serializers.HyperlinkedModelSerializer):
#     user = serializers.ReadOnlyField(source='user.username')
#     tags = TagField()
#
#     class Meta:
#         model = Thought
#         fields = ['id', 'content', 'created_at', 'user', 'tags']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'contact', 'created_at']


class TimeSlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlip
