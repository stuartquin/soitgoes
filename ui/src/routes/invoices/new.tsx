import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import InvoiceSelectProject from "components/Invoices/InvoiceSelectProject";

export const Route = createFileRoute("/invoices/new")({
  component: InvoiceSelectProjectRoute,
});

function InvoiceSelectProjectRoute() {
  const { projects } = Route.useRouteContext();

  return <InvoiceSelectProject projects={projects} />;
}
