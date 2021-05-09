import React, { useMemo, useState, useEffect } from "react";
import { groupBy } from "lodash";
import { format } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";

import Project from "components/TimeSheet/Project";

interface Props {
  user: models.User;
  projects: models.Project[];
  start: Date;
}

function TimeSheet({ user, projects, start }: Props) {
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [timeSlips, setTimeSlips] = useState<models.TimeSlip[]>([]);

  useEffect(() => {
    const load = async () => {
      const api = getClient();

      const taskResponse = await api.listTasks({});
      setTasks(taskResponse.results || []);

      const timeSlipResponse = await api.listTimeSlips({
        start: format(start, "yyyy-MM-dd"),
      });
      setTimeSlips(timeSlipResponse.results || []);
    };

    load();
  }, [start]);

  const projectTasks = useMemo(() => {
    return groupBy(tasks, "project");
  }, [tasks]);

  const projectTimeSlips = useMemo(() => {
    return groupBy(timeSlips, "project");
  }, [timeSlips]);

  return (
    <div className="p-3">
      {projects.map((project) => (
        <Project
          key={project.id}
          project={project}
          timeSlips={projectTimeSlips[project.id || ""] || []}
          tasks={projectTasks[project.id || ""] || []}
          start={start}
        />
      ))}
    </div>
  );
}

export default TimeSheet;
