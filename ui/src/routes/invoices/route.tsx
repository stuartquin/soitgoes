import { createFileRoute } from "@tanstack/react-router";

import Invoices from "components/Invoices";
import {
  listInvoicesOptions,
  listProjectsOptions,
  listProjectSummariesOptions,
} from "apiv3/@tanstack/react-query.gen";

export const Route = createFileRoute("/invoices")({
  component: InvoicesRoute,
  loader: async ({ context: { queryClient } }) => {
    const [projects, summaries, invoices] = await Promise.all([
      queryClient.fetchQuery(listProjectsOptions()),
      queryClient.fetchQuery(listProjectSummariesOptions()),
      queryClient.fetchQuery(
        listInvoicesOptions({
          query: { limit: 50 },
        })
      ),
    ]);

    return {
      projects: projects.results,
      invoices: invoices.results,
      summaries: summaries.results,
    };
  },
});

function InvoicesRoute() {
  const { projects, summaries, invoices } = Route.useLoaderData();

  return (
    <Invoices projects={projects} invoices={invoices} summaries={summaries} />
  );
}
