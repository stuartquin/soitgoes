import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import Invoices from "components/Invoices";
import { fetchInvoicesFor } from "services/fetchInvoicesFor";

export const Route = createFileRoute("/invoices/")({
  loader: () => fetchInvoicesFor(),
  component: InvoicesRoute,
});

function InvoicesRoute() {
  const invoices = Route.useLoaderData();
  const { projects } = Route.useRouteContext();

  return <Invoices projects={projects} invoices={invoices} />;
}
