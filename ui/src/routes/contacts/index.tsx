import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import Contacts from "components/Contacts";

export const Route = createFileRoute("/contacts/")({
  component: ContactsRoute,
});

function ContactsRoute() {
  return <Contacts />;
}
