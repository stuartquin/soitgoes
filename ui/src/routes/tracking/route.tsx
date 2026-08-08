import { Outlet, createFileRoute } from "@tanstack/react-router";

import {
  listTrackedTimesOptions,
  listTasksOptions,
} from "apiv3/@tanstack/react-query.gen";
import {
  getDate,
  getStartOfMonth,
  getEndOfMonth,
  formatQuery,
} from "lib/date";
import TrackedTimeList from "components/tracking/TrackedTimeList";

type SearchParams = {
  project?: number;
  start?: string;
  end?: string;
};

export const Route = createFileRoute("/tracking")({
  component: TrackedTimeRoute,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const project =
      typeof search.project === "number" ? search.project : undefined;
    // Default to the current month when no range is provided so the list
    // shows a sensible, bounded window of entries on first visit.
    const now = new Date();
    const start =
      typeof search.start === "string"
        ? search.start
        : formatQuery(getStartOfMonth(now));
    const end =
      typeof search.end === "string"
        ? search.end
        : formatQuery(getEndOfMonth(now));
    return { project, start, end };
  },
  loaderDeps: ({ search: { project, start, end } }) => ({
    project,
    start,
    end,
  }),
  loader: async ({
    deps: { project, start, end },
    context: { queryClient },
  }) => {
    const [trackedTimesResponse, tasksResponse] = await Promise.all([
      queryClient.fetchQuery(
        listTrackedTimesOptions({
          query: {
            ...(project ? { project: String(project) } : {}),
            ...(start ? { start } : {}),
            ...(end ? { end } : {}),
          },
        })
      ),
      queryClient.fetchQuery(listTasksOptions({ query: { state: "OPEN" } })),
    ]);

    return {
      trackedTimes: trackedTimesResponse.results,
      tasks: tasksResponse.results,
      filters: {
        project,
        start: start ? getDate(start) : undefined,
        end: end ? getDate(end) : undefined,
      },
    };
  },
});

function TrackedTimeRoute() {
  const { trackedTimes, tasks, filters } = Route.useLoaderData();
  const { projects } = Route.useRouteContext();
  return (
    <>
      <TrackedTimeList
        trackedTimes={trackedTimes}
        projects={projects}
        tasks={tasks}
        filters={filters}
      />
      <Outlet />
    </>
  );
}
