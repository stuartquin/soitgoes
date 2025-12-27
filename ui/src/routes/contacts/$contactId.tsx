import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import Contacts from "components/Contacts";

export const Route = createFileRoute("/contacts/$contactId")({
  component: ContactDetailRoute,
});

function ContactDetailRoute() {
  const { contactId } = Route.useParams();

  return <Contacts contactId={contactId} />;
}
