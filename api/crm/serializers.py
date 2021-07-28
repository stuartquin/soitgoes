from rest_framework import serializers

import crm.models as models


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Note
        fields = [
            "id",
            "content",
            "contact",
            "created_at",
        ]
