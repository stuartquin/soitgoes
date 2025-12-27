import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import InvoiceCreateNew from "components/Invoices/InvoiceCreateNew";

export const Route = createFileRoute("/invoices/$projectId/")({
  component: InvoiceCreateNewRoute,
});

function InvoiceCreateNewRoute() {
  const { projectId } = Route.useParams();
  const { projects } = Route.useRouteContext();

  return <InvoiceCreateNew projects={projects} projectId={projectId} />;
}
