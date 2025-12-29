import { createFileRoute } from "@tanstack/react-router";

import InvoiceSelectProject from "components/Invoices/InvoiceSelectProject";
import {
  listProjectsOptions,
  listProjectSummariesOptions,
} from "apiv3/@tanstack/react-query.gen";

export const Route = createFileRoute("/invoices/new")({
  component: Component,
  loader: async ({ context: { queryClient } }) => {
    const [projects, summaries] = await Promise.all([
      queryClient.fetchQuery(listProjectsOptions()),
      queryClient.fetchQuery(listProjectSummariesOptions()),
    ]);

    return {
      projects: projects.results,
      summaries: summaries.results,
    };
  },
});

function Component() {
  const { projects, summaries } = Route.useLoaderData();

  return <InvoiceSelectProject summaries={summaries} projects={projects} />;
}
