import { createFileRoute } from "@tanstack/react-router";

import InvoiceSelectProject from "components/Invoices/InvoiceSelectProject";
import {
  listProjectsOptions,
  listProjectSummariesOptions,
} from "apiv3/@tanstack/react-query.gen";

export const Route = createFileRoute("/invoices/new")({
  component: Component,
  loader: async ({ context: { queryClient } }) => {
    const [projects, summary] = await Promise.all([
      queryClient.fetchQuery(listProjectsOptions()),
      queryClient.fetchQuery(listProjectSummariesOptions()),
    ]);

    return {
      projects: projects.results,
      summary,
    };
  },
});

function Component() {
  const { projects, summary } = Route.useLoaderData();

  return <InvoiceSelectProject summary={summary} projects={projects} />;
}
