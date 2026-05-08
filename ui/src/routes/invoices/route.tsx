import { createFileRoute } from "@tanstack/react-router";

import Invoices from "components/Invoices";
import {
  listInvoicesOptions,
  listProjectsOptions,
  listProjectSummariesOptions,
} from "apiv3/@tanstack/react-query.gen";
import { Invoice } from "apiv3";

type InvoiceSearchParams = {
  status?: Invoice["status"];
  project?: number;
};

export const Route = createFileRoute("/invoices")({
  component: InvoicesRoute,
  validateSearch: (search: Record<string, unknown>): InvoiceSearchParams => {
    return {
      status: ["DRAFT", "ISSUED", "PAID"].includes(search.status as string)
        ? (search.status as Invoice["status"])
        : undefined,
      project: typeof search.project === "number" ? search.project : undefined,
    };
  },
  loaderDeps: ({ search: { status, project } }) => ({ status, project }),
  loader: async ({
    deps: { status, project },
    context: { queryClient },
  }) => {
    const [projects, summary, invoices] = await Promise.all([
      queryClient.fetchQuery(listProjectsOptions()),
      queryClient.fetchQuery(listProjectSummariesOptions()),
      queryClient.fetchQuery(
        listInvoicesOptions({
          query: {
            limit: 100,
            ...(status ? { status } : {}),
            ...(project ? { project } : {}),
          },
        })
      ),
    ]);

    return {
      projects: projects.results,
      invoices: invoices.results,
      summary,
      filters: { status, project },
    };
  },
});

function InvoicesRoute() {
  const { projects, summary, invoices, filters } = Route.useLoaderData();
  return (
    <Invoices
      projects={projects}
      invoices={invoices}
      summary={summary}
      filters={filters}
    />
  );
}
