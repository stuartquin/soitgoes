from .models import Thought
from rest_framework import serializers


class TagField(serializers.Field):
    def to_representation(self, obj):
        return obj.strip(",").split(",")

    def to_internal_value(self, data):
        return "," + ",".join(data) + ","


class ThoughtSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    tags = TagField()

    class Meta:
        model = Thought
        fields = ['id', 'content', 'created_at', 'user', 'tags']
