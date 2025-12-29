import { useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";

import TimeSheet from "components/TimeSheet";
import {
  listProjectsOptions,
  listTasksOptions,
  listTimeSlipsOptions,
} from "apiv3/@tanstack/react-query.gen";
import { getStartOfWeek, getTimeSlipQueryRange } from "lib/date";

export const Route = createFileRoute("/time")({
  component: TimeRoute,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      date: typeof search.date === "string" ? search.date : undefined,
      task: search.task ? (search.task as string) : undefined,
    };
  },

  loaderDeps: ({ search: { date, task } }) => ({ date, task }),
  loader: async ({ deps: { date }, context: { queryClient } }) => {
    const [start, end] = getTimeSlipQueryRange(date);

    const [projects, timeSlips, tasks] = await Promise.all([
      queryClient.fetchQuery(listProjectsOptions()),
      queryClient.fetchQuery(
        listTimeSlipsOptions({
          query: { start, end },
        })
      ),
      queryClient.fetchQuery(
        listTasksOptions({
          query: { state: "OPEN" },
        })
      ),
    ]);

    return {
      projects: projects.results,
      timeSlips: timeSlips.results,
      tasks: tasks.results,
      startDate: getStartOfWeek(date),
    };
  },
});

function TimeRoute() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  const { timeSlips, projects, tasks, startDate } = Route.useLoaderData();

  const handleClose = useCallback(
    (startDate: Date) => {
      navigate({
        to: "/time",
        search: { date: format(startDate, "yyyy-MM-dd"), task: undefined },
      });
    },
    [navigate]
  );

  return (
    <TimeSheet
      user={user}
      projects={projects}
      timeSlips={timeSlips}
      tasks={tasks}
      startDate={startDate}
      onClose={handleClose}
    />
  );
}
