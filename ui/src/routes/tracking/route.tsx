import { Outlet, createFileRoute } from "@tanstack/react-router";

import {
  listTrackedTimesOptions,
  listTasksOptions,
} from "apiv3/@tanstack/react-query.gen";
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
    const [trackedTimesResponse, tasksResponse] = await Promise.all([
      queryClient.fetchQuery(
        listTrackedTimesOptions({
          query: { ...(project ? { project: String(project) } : {}) },
        })
      ),
      queryClient.fetchQuery(listTasksOptions({ query: { state: "OPEN" } })),
    ]);

    return {
      trackedTimes: trackedTimesResponse.results,
      tasks: tasksResponse.results,
      filters: { project },
    };
  },
});

function TrackedTimeRoute() {
  const { trackedTimes, tasks } = Route.useLoaderData();
  const { projects } = Route.useRouteContext();
  return (
    <>
      <TrackedTimeList
        trackedTimes={trackedTimes}
        projects={projects}
        tasks={tasks}
      />
      <Outlet />
    </>
  );
}
