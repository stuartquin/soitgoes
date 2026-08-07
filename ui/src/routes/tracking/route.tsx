import { createFileRoute } from "@tanstack/react-router";

import { listTrackedTimesOptions } from "apiv3/@tanstack/react-query.gen";
import TrackedTimeList from "components/tracking/TrackedTimeList";

type SearchParams = {
  project?: number;
};

export const Route = createFileRoute("/tracking")({
  component: TrackedTimeRoute,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      project: typeof search.project === "number" ? search.project : undefined,
    };
  },
  loaderDeps: ({ search: { project } }) => ({ project }),
  loader: async ({ deps: { project }, context: { queryClient } }) => {
    const [trackedTimesResponse] = await Promise.all([
      queryClient.fetchQuery(
        listTrackedTimesOptions({
          query: { ...(project ? { project: String(project) } : {}) },
        })
      ),
    ]);

    return {
      trackedTimes: trackedTimesResponse.results,
      filters: { project },
    };
  },
});

function TrackedTimeRoute() {
  const { trackedTimes } = Route.useLoaderData();
  const { projects } = Route.useRouteContext();
  return <TrackedTimeList trackedTimes={trackedTimes} projects={projects} />;
}
