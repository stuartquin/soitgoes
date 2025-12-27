import React, { useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";

import TimeSheet from "components/TimeSheet";
import { validateTimeSearch } from "routes/timeSearch";

export const Route = createFileRoute("/time")({
  validateSearch: validateTimeSearch,
  component: TimeRoute,
});

function TimeRoute() {
  const { user, projects } = Route.useRouteContext();
  const { date, task } = Route.useSearch();
  const navigate = useNavigate();

  const handleClose = useCallback(
    (startDate: Date) => {
      navigate({
        to: "/time",
        search: { date: format(startDate, "yyyy-MM-dd") },
      });
    },
    [navigate]
  );

  return (
    <TimeSheet
      user={user}
      projects={projects}
      dateStr={date}
      selectedTaskId={task}
      onClose={handleClose}
    />
  );
}
