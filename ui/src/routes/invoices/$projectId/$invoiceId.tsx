import { createFileRoute } from "@tanstack/react-router";

import InvoiceDetail from "components/Invoices/InvoiceDetail";

export const Route = createFileRoute("/invoices/$projectId/$invoiceId")({
  component: InvoiceDetailRoute,
});

function InvoiceDetailRoute() {
  const { projectId, invoiceId } = Route.useParams();
  const { projects } = Route.useRouteContext();

  return (
    projects?.length && (
      <InvoiceDetail
        projects={projects}
        projectId={projectId}
        invoiceId={invoiceId}
      />
    )
  );
}
