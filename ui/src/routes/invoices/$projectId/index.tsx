import { createFileRoute } from "@tanstack/react-router";
import {
  listInvoiceModifiersOptions,
  listProjectsOptions,
  listProjectSummariesOptions,
  listTasksOptions,
  listTimeSlipsOptions,
  retrieveExchangeRateOptions,
} from "apiv3/@tanstack/react-query.gen";

import InvoiceCreateNew from "components/Invoices/InvoiceCreateNew";

export const Route = createFileRoute("/invoices/$projectId/")({
  component: InvoiceCreateNewRoute,
  loader: async ({ params, context: { queryClient } }) => {
    const [projects, summaries, timeSlips, tasks, modifiers, exchangeRates] =
      await Promise.all([
        queryClient.fetchQuery(listProjectsOptions()),
        queryClient.fetchQuery(listProjectSummariesOptions()),
        queryClient.fetchQuery(
          listTimeSlipsOptions({
            query: {
              no_invoice: "true",
              project: params.projectId,
            },
          })
        ),
        queryClient.fetchQuery(
          listTasksOptions({
            query: { project: params.projectId },
          })
        ),
        queryClient.fetchQuery(listInvoiceModifiersOptions()),
        queryClient.fetchQuery(retrieveExchangeRateOptions()),
      ]);

    return {
      projects: projects.results,
      summaries: summaries.results,
      timeSlips: timeSlips.results,
      tasks: tasks.results,
      modifiers: modifiers.results,
      exchangeRates: exchangeRates.rates,
    };
  },
});

function InvoiceCreateNewRoute() {
  const { projectId } = Route.useParams();
  const { timeSlips, projects, summaries, tasks, modifiers, exchangeRates } =
    Route.useLoaderData();

  return (
    <InvoiceCreateNew
      projects={projects}
      projectId={projectId}
      summaries={summaries}
      timeSlips={timeSlips}
      modifiers={modifiers}
      tasks={tasks}
      exchangeRates={exchangeRates || {}}
    />
  );
}
