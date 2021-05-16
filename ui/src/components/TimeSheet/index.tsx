import React, { useContext, useMemo } from "react";
import { groupBy } from "lodash";

import * as models from "api/models";

import Project from "components/TimeSheet/Project";
import { TimeSlipContext } from "components/TimeSheet/TimeSlipContext";

interface Props {
  user: models.User;
  projects: models.Project[];
}

function TimeSheet({ user, projects }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const { tasks, dateRange } = timeSheet;
  const projectTasks = useMemo(() => {
    return groupBy(tasks, "project");
  }, [tasks]);

  return (
    <div className="p-3">
      {projects.map((project) => (
        <Project
          key={project.id}
          project={project}
          dateRange={dateRange}
          tasks={projectTasks[project.id || ""] || []}
        />
      ))}
    </div>
  );
}

export default TimeSheet;
