from django.db.models import (
    Case,
    CharField,
    ExpressionWrapper,
    F,
    OuterRef,
    QuerySet,
    Subquery,
    Value,
    When
)
from django.db.models.functions import Concat

from financeapp.models import BankAccount, Tag
from journal.models import Invoice, Project


def get_tags_with_display_value(tags: QuerySet[Tag]):
    """
    Annotate queryset with `display_name` properties pulled from matching
    `journal.Project` where `value` matches
    """
    return tags.annotate(
        display_value=Case(
            When(
                tag_type="project",
                then=Subquery(
                    Project.objects.filter(id=OuterRef("value")).values("name")[:1]
                ),
            ),
            When(
                tag_type="invoice",
                then=Subquery(
                    Invoice.objects.filter(id=OuterRef("value"))
                    .select_related("project")
                    .annotate(
                        name=Concat(
                            Value("#"),
                            "sequence_num",
                            Value(" "),
                            "project__name",
                            output_field=CharField(),
                        )
                    )
                    .values("name")[:1]
                ),
            ),
            When(
                tag_type="transfer",
                then=Subquery(
                    BankAccount.objects.filter(id=OuterRef("value")).values("name")[:1],
                    output_field=CharField(),
                ),
            ),
            default=ExpressionWrapper(F("value"), output_field=CharField()),
        )
    )
